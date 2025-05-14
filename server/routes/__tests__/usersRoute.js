// __tests__/usersRoute.js
import request from 'supertest';
import express from 'express';
import userRoute from '../users.js'; 
import User from '../../models/User.js';

//This jests the database calls
jest.mock('../../models/User.js');

const app = express();
app.use(express.json());
app.use('/api/users', userRoute); 

//Clears previous mock calls before each test
beforeEach(() => {
  jest.clearAllMocks();
})

describe('User routes', () => {

  it('should return error for missing fields', async () => {
    const res = await request(app).post('/api/users').send({});
    expect(res.status).toBe(400);
  });

  it('should return error for invalid username', async () => {
    const res = await request(app).post('/api/users').send({
      username: '!!',
      email: 'test@test.com',
      password: '123456',
      firstName: 'John',
      lastName: 'Doe',
    });
    expect(res.status).toBe(422);
  });

  it('should return error for invalid email', async () => {
    const res = await request(app).post('/api/users').send({
      username: 'validname',
      email: 'invalidemail',
      password: '123456',
      firstName: 'John',
      lastName: 'Doe',
    });
    expect(res.status).toBe(422);
  });

  //Check for existing username
  it('should return error if username exists', async () => {
    User.findOne.mockResolvedValueOnce({});
    const res = await request(app).post('/api/users').send({
      username: 'testuser',
      email: 'test@test.com',
      password: '123456',
      firstName: 'John',
      lastName: 'Doe',
    });
    expect(res.status).toBe(409);
  });

  //Checks existing email
  it('should return error if email exists', async () => {
    User.findOne
      .mockResolvedValueOnce(null) // username not exists
      .mockResolvedValueOnce({});  // email exists

    const res = await request(app).post('/api/users').send({
      username: 'newuser',
      email: 'test@test.com',
      password: '123456',
      firstName: 'John',
      lastName: 'Doe',
    });
    expect(res.status).toBe(409);
  });

  //Checks short password
  it('should return error for short password', async () => {
    const res = await request(app).post('/api/users').send({
      username: 'newuser',
      email: 'test@test.com',
      password: '123',
      firstName: 'John',
      lastName: 'Doe',
    });
    expect(res.status).toBe(422);
  });

  //Checks created user
  it('should create a user', async () => {
    User.findOne
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);

      User.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue({
          username: 'newuser',
          email: 'test@test.com',
          firstName: 'John',
          lastName: 'Doe',
        }),
      }));

    const res = await request(app).post('/api/users').send({
      username: 'newuser',
      email: 'test@test.com',
      password: '123456',
      firstName: 'John',
      lastName: 'Doe',
    });

    expect(res.status).toBe(201);
    expect(res.body.username).toBe('newuser');
  });

  it('should handle server error', async () => {
    User.findOne.mockRejectedValueOnce(new Error('DB down'));

    const res = await request(app).post('/api/users').send({
      username: 'newuser',
      email: 'test@test.com',
      password: '123456',
      firstName: 'John',
      lastName: 'Doe',
    });

    expect(res.status).toBe(500);
  });
});
