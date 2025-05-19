// server/routes/__tests__/postsRoute.test.js
import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import postRoute from '../posts.js';
import Post from '../../models/Post.js';

// 1) Mock the upload middleware so it just passes through
jest.mock('../../middlewares/upload.js', () => ({
  single: () => (req, res, next) => next()
}));

// 2) Spy on jwt.verify so requireAuth always thinks the token is valid
jest.spyOn(jwt, 'verify').mockImplementation(() => ({
  id: 'user123',
  isAdmin: false,
}));

describe('POSTS ROUTER', () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks();
    app = express();
    app.use(express.json());
    // Mount your posts router
    app.use('/api/posts', postRoute);
  });

  it('❌ 401 when no cookie provided', async () => {
    const res = await request(app)
      .post('/api/posts')
      .send({ title: 'Foo', content: 'Bar' });

    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/Not authenticated/);
  });

  it('✅ creates a new post when authenticated', async () => {
    // 3) Create a fresh app that injects fake cookie before postRoute
    const authed = express();
    authed.use(express.json());
    authed.use((req, res, next) => {
      req.cookies = { token: 'fake-jwt-token' };
      next();
    });
    authed.use('/api/posts', postRoute);

    // 4) Stub Post.prototype.save() to resolve with the saved doc
    const fakeDoc = {
      _id: 'p1',
      title: 'Hello',
      content: 'World',
      user: 'user123',
      tags: ['a','b'],
      categories: ['x'],
      save: jest.fn().mockResolvedValue(true)
    };
    jest.spyOn(Post, 'constructor').mockImplementation(() => fakeDoc);
    const res = await request(authed)
      .post('/api/posts')
      .send({ title: 'Hello', content: 'World', tags: 'a,b', categories: ['x'] });

    expect(res.status).toBe(201);
    expect(fakeDoc.save).toHaveBeenCalled();
    expect(res.body.title).toBe('Hello');
  });

  it('✅ rejects invalid rating', async () => {
    const authed = express();
    authed.use(express.json());
    authed.use((req, res, next) => {
      req.cookies = { token: 'fake-jwt-token' };
      next();
    });
    authed.use('/api/posts', postRoute);

    const res = await request(authed)
      .post('/api/posts/anything/rate')
      .send({ rating: 0 });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Rating must be between 1 and 5/);
  });
});
