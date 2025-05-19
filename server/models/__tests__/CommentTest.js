import mongoose from 'mongoose';
import Comment from '../Comment.js'; // Adjust the path if needed

describe('Comment Model', () => {
  beforeAll(async () => {
    // Connect to a test database
    await mongoose.connect('mongodb://127.0.0.1:27017/commentTestDB', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    // Clean up the database and close the connection
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  it('✅ saves a valid comment', async () => {
    const validComment = new Comment({
      content: 'This is a test comment',
      user: new mongoose.Types.ObjectId(),
      post: new mongoose.Types.ObjectId(),
    });

    const savedComment = await validComment.save();

    expect(savedComment._id).toBeDefined();
    expect(savedComment.content).toBe('This is a test comment');
    expect(savedComment.user).toBeDefined();
    expect(savedComment.post).toBeDefined();
  });

  it('❌ fails to save a comment without required fields', async () => {
    const invalidComment = new Comment({
      content: 'This is a test comment',
    });

    let error;
    try {
      await invalidComment.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.user).toBeDefined();
    expect(error.errors.post).toBeDefined();
  });

  it('❌ fails to save a comment with content exceeding the maximum length', async () => {
    const longContent = 'a'.repeat(1001); // Assuming the max length is 1000 characters
    const invalidComment = new Comment({
      content: longContent,
      user: new mongoose.Types.ObjectId(),
      post: new mongoose.Types.ObjectId(),
    });

    let error;
    try {
      await invalidComment.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.content).toBeDefined();
  });
});
