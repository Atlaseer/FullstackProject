import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import dotenv from 'dotenv';

const router = express.Router();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if(!username || !password)
    {
        return res.status(400).json({error: 'Username and password required'});
    }

    const user = await User.findOne({username});
    if(!user)
    {
        return res.status(401).json({error: 'Invalid credentials'});
    }
    
    const valid = await bcrypt.compare(password, user.password);
    if(!valid)
    {
        return res.status(401).json({error: 'Invalid credentials'});
    }

    // If JWT_SECRET is not set, run the generateJWT_SecretONCE.mjs file to get a code for it

    const token = jwt.sign(
        {
            id: user._id,
            username: user.username
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    )

    res.cookie('token', token, {
        httpOnly:true,
        secure: false, // Set to true if using HTTPS
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60, // 1 hour
    })

    res.json({message: 'Login successful', token, user: {username: user.username, id: user._id}})
})



router.get('/me', (req, res) => {
    const token = req.cookies.token;

    if(!token)
    {
        return res.status(401).json({error: 'Not logged in'});
    }

    try 
    {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        res.json(user);
    }
    catch(error)
    {
        res.status(403).json({error: 'Invalid or expired token'});
    }
})


router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({message: 'Logout successful'});
})


export default router;