import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcrypt';
import path from 'path';
import dotenv from 'dotenv';

import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import commentRoutes from './routes/comments.js';
import authRoutes from './routes/auth.js';

import ip from 'ip'; // Importing the ip module to get the local IP address
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url'; // Used to get __dirname in ES module
dotenv.config();

const app = express();


// How to get __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Configure static file directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 3000;

const allowedOrigins = ['http://localhost:5173', 'http://localhost']

//Middleware
app.use(cors({
    origin: function (origin, callback) {
      //const allowedOrigins = ['http://localhost:5173'];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`Blocked by CORS: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  }));

app.use(cookieParser());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/comments', commentRoutes);


app.get('/', (req, res) => {
    res.send('Server is running...')
})

app.get('/api/message', (req, res) => {
    //console.log('Message is retrieved from backend')
    res.json({ message: 'Message from backend' })
})

const ipAddress = ip.address(); // Get the local IP address

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB')
        app.listen(PORT, () => {
            console.log(`Server is running on port http://localhost:${PORT}`)
            console.log(`Server is running on http://${ipAddress}:${PORT}`); // Log the local IP address
        });
    })
    .catch(err => {
        console.error('failed to connect to MongoDB', err)
    })
