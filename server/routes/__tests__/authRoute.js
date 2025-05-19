// __tests__/authRoute.js
import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import authRoute from '../auth.js'; // Adjust the path if needed
import User from '../../models/User.js';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoute);

jest.mock('../../models/User.js'); // Mock the User model
jest.mock('jsonwebtoken'); // Mock the jwt library

describe('Auth Route', () => {
  let mockUser;

  beforeEach(() => {
    // Mock user data
    mockUser = {
      _id: 'user123',
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'hashedpassword',
      isAdmin: false,
      isActive: true,
      comparePassword: jest.fn().mockResolvedValue(true), // Mock password comparison
    };

    // Mock User.findOne to return the mock user
    User.findOne = jest.fn().mockResolvedValue(mockUser);

    // Mock jwt.sign and jwt.verify
    jwt.sign = jest.fn().mockReturnValue('fake-jwt-token');
    jwt.verify = jest.fn().mockReturnValue({
      id: mockUser._id,
      username: mockUser.username,
      isAdmin: mockUser.isAdmin,
      isActive: mockUser.isActive,
    });
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it('✅ logs in a user with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'testuser',
        password: 'password123',
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Login successful');
    expect(res.body.token).toBe('fake-jwt-token');
    expect(res.body.user.username).toBe('testuser');
    expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
    expect(mockUser.comparePassword).toHaveBeenCalledWith('password123');
  });

  it('❌ rejects login with invalid credentials', async () => {
    mockUser.comparePassword = jest.fn().mockResolvedValue(false); // Mock invalid password

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'testuser',
        password: 'wrongpassword',
      });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid username or password');
    expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
    expect(mockUser.comparePassword).toHaveBeenCalledWith('wrongpassword');
  });

  it('✅ fetches user info from token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Cookie', ['token=fake-jwt-token']); // Set the fake token in cookies

    expect(res.status).toBe(200);
    expect(res.body.username).toBe('testuser');
    expect(res.body.isAdmin).toBe(false);
    expect(jwt.verify).toHaveBeenCalledWith('fake-jwt-token', process.env.JWT_SECRET);
  });

  it('❌ rejects fetching user info without a token', async () => {
    const res = await request(app).get('/api/auth/me'); // No token provided

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Not logged in');
  });

  it('❌ rejects fetching user info with an invalid token', async () => {
    jwt.verify = jest.fn(() => {
      throw new Error('Invalid token'); // Mock invalid token
    });

    const res = await request(app)
      .get('/api/auth/me')
      .set('Cookie', ['token=invalid-token']); // Set an invalid token in cookies

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('Invalid or expired token');
    expect(jwt.verify).toHaveBeenCalledWith('invalid-token', process.env.JWT_SECRET);
  });
});
