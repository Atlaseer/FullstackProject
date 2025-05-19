import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../User.js'; // Adjust the path if needed

describe('User Model', () => {
  beforeAll(async () => {
    // Connect to a test database
    await mongoose.connect('mongodb://127.0.0.1:27017/userTestDB', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    // Clean up the database and close the connection
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  it('✅ saves a valid user', async () => {
    const validUser = new User({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
    });

    const savedUser = await validUser.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe('testuser');
    expect(savedUser.email).toBe('testuser@example.com');
    expect(savedUser.password).toBeDefined(); // Password should be hashed
    expect(savedUser.firstName).toBe('Test');
    expect(savedUser.lastName).toBe('User');
  });

  it('❌ fails to save a user without required fields', async () => {
    const invalidUser = new User({
      email: 'testuser@example.com',
    });

    let error;
    try {
      await invalidUser.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.username).toBeDefined();
    expect(error.errors.password).toBeDefined();
  });

  it('✅ hashes the password before saving', async () => {
    const user = new User({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
    });

    const savedUser = await user.save();

    // Ensure the password is hashed
    expect(savedUser.password).not.toBe('password123');
    const isMatch = await bcrypt.compare('password123', savedUser.password);
    expect(isMatch).toBe(true);
  });

  it('✅ compares passwords correctly using comparePassword', async () => {
    const user = new User({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
    });

    await user.save();

    const isMatch = await user.comparePassword('password123');
    expect(isMatch).toBe(true);

    const isNotMatch = await user.comparePassword('wrongpassword');
    expect(isNotMatch).toBe(false);
  });
});