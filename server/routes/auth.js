import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import dotenv from 'dotenv';

const router = express.Router();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    //Validates username and password
    if(!username || !password) {
        return res.status(400).json({error: 'Username and password required'});
    }

    //Finds user by username
    const user = await User.findOne({username});
    if(!user) {
        return res.status(401).json({error: 'Invalid credentials'});
    }
    
    //Verifies password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        return res.status(401).json({error: 'Invalid credentials'});
    }

    // If JWT_SECRET is not set, run the generateJWT_SecretONCE.mjs file to get a code for it

    const token = jwt.sign({
            id: user._id,
            username: user.username,
            admin: user.isAdmin,
            active: user.isActive,
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

    res.json({message: 'Login successful', token, user: {username: user.username, id: user._id, admin: user.isAdmin, active: user.isActive}});
})

//Get user info from token
router.get('/me', (req, res) => {
    console.log('Request received at /api/auth/me endpoint');
    const token = req.cookies.token;

    if (!token) {
        console.log('No token found');
        return res.status(401).json({ error: 'Not logged in' });
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token verified successfully', user);

        // Ensure admin and active properties are included in the response
        const { id, username, admin, active } = user;

        if (admin === undefined || active === undefined) {
            return res.status(500).json({ error: 'Token payload is missing required properties' });
        }

        // Check if the user is active
        if (!active) {
            return res.status(403).json({ error: 'User is inactive' });
        }

        // Check if the user is an admin
        if (!admin) {
            return res.status(403).json({ error: 'User is not an admin' });
        }

        res.json({ id, username, admin, active });
    } catch (error) {
        console.error('Token verification failed', error);
        res.status(403).json({ error: 'Invalid or expired token' });
    }
})

router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({message: 'Logout successful'});
})

export default router;
