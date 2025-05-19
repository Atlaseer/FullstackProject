// __tests__/commentsRoute.js
import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import commentsRoute from '../comments.js';
import Comment from '../../models/Comment.js';
import Post from '../../models/Post.js';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/comments', commentsRoute);

jest.mock('../../models/Comment.js'); // Mock the Comment model
jest.mock('../../models/Post.js'); // Mock the Post model
jest.mock('jsonwebtoken'); // Mock the jwt library

describe('Comments Route', () => {
  let mockComment, mockPost, token;

  beforeEach(() => {
    // Mock comment data
    mockComment = {
      _id: 'comment123',
      content: 'This is a test comment',
      user: 'user123',
      post: 'post123',
      save: jest.fn().mockResolvedValue(true),
    };

    // Mock post data
    mockPost = {
      _id: 'post123',
      title: 'Test Post',
      content: 'This is a test post',
      comments: ['comment123'],
      save: jest.fn().mockResolvedValue(true),
    };

    // Mock Comment and Post methods
    Comment.create = jest.fn().mockResolvedValue(mockComment);
    Comment.find = jest.fn().mockResolvedValue([mockComment]);
    Comment.findByIdAndDelete = jest.fn().mockResolvedValue(mockComment);
    Post.findById = jest.fn().mockResolvedValue(mockPost);

    // Mock jwt
    jwt.verify = jest.fn().mockReturnValue({
      id: 'user123',
      username: 'testuser',
    });

    // Mock token
    token = 'fake-jwt-token';
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it('✅ creates a new comment', async () => {
    const res = await request(app)
      .post('/api/comments')
      .set('Cookie', [`token=${token}`]) // Set the fake token in cookies
      .send({
        content: 'This is a test comment',
        postId: 'post123',
      });

    expect(res.status).toBe(201);
    expect(res.body.content).toBe('This is a test comment');
    expect(res.body.post).toBe('post123');
    expect(Comment.create).toHaveBeenCalledWith({
      content: 'This is a test comment',
      user: 'user123',
      post: 'post123',
    });
    expect(Post.findById).toHaveBeenCalledWith('post123');
    expect(mockPost.save).toHaveBeenCalled();
  });

  it('✅ fetches comments for a post', async () => {
    const res = await request(app)
      .get('/api/comments?postId=post123');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].content).toBe('This is a test comment');
    expect(Comment.find).toHaveBeenCalledWith({ post: 'post123' });
  });

  it('✅ deletes a comment', async () => {
    const res = await request(app)
      .delete('/api/comments/comment123')
      .set('Cookie', [`token=${token}`]); // Set the fake token in cookies

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Comment deleted successfully');
    expect(Comment.findByIdAndDelete).toHaveBeenCalledWith('comment123');
  });

  it('❌ rejects creating a comment without a token', async () => {
    const res = await request(app)
      .post('/api/comments')
      .send({
        content: 'This is a test comment',
        postId: 'post123',
      });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Not authenticated');
  });

  it('❌ rejects creating a comment for a non-existent post', async () => {
    Post.findById = jest.fn().mockResolvedValue(null); // Mock post not found

    const res = await request(app)
      .post('/api/comments')
      .set('Cookie', [`token=${token}`])
      .send({
        content: 'This is a test comment',
        postId: 'nonexistentpost',
      });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Post not found');
    expect(Post.findById).toHaveBeenCalledWith('nonexistentpost');
  });
});
