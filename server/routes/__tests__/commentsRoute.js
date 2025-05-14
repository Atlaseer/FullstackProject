// __tests__/commentsRoute.js
import request from 'supertest';
import express from 'express';
import userRoute from '../users.js'; 

const app = express();
app.use(express.json());

app.use('/api/posts', userRoute); 