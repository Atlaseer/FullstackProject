import mongoose from 'mongoose';
import Post from '../Post.js'; // Adjust the path if needed

describe('Post Model', () => {
  beforeAll(async () => {
    // Connect to a test database
    await mongoose.connect('mongodb://127.0.0.1:27017/postTestDB', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    // Clean up the database and close the connection
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  it('✅ saves a valid post', async () => {
    const validPost = new Post({
      title: 'Test Post',
      content: 'This is a test post.',
      user: new mongoose.Types.ObjectId(),
      tags: ['test', 'jest'],
      categories: ['unit'],
    });

    const savedPost = await validPost.save();

    expect(savedPost._id).toBeDefined();
    expect(savedPost.title).toBe('Test Post');
    expect(savedPost.content).toBe('This is a test post.');
    expect(savedPost.user).toBeDefined();
    expect(savedPost.tags).toEqual(['test', 'jest']);
    expect(savedPost.categories).toEqual(['unit']);
  });

  it('❌ fails to save a post without required fields', async () => {
    const invalidPost = new Post({
      content: 'This is a test post without a title.',
    });

    let error;
    try {
      await invalidPost.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.title).toBeDefined();
    expect(error.errors.user).toBeDefined();
  });

  it('❌ fails to save a post with a title exceeding the maximum length', async () => {
    const longTitle = 'a'.repeat(201); // Assuming the max length is 200 characters
    const invalidPost = new Post({
      title: longTitle,
      content: 'This is a test post.',
      user: new mongoose.Types.ObjectId(),
    });

    let error;
    try {
      await invalidPost.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.title).toBeDefined();
  });

  it('✅ defaults views to 0 if not provided', async () => {
    const postWithoutViews = new Post({
      title: 'Test Post Without Views',
      content: 'This is a test post.',
      user: new mongoose.Types.ObjectId(),
    });

    const savedPost = await postWithoutViews.save();

    expect(savedPost.views).toBe(0); // Assuming the default value for views is 0
  });
});
