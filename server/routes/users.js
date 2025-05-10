import express from 'express';
import User from '../models/User.js';

const router = express.Router();

//Create new user

router.post('/', async (req, res) => {
    try {
        //Check if username or email already exists

        const username = req.body.username?.trim();
        const email = req.body.email?.trim();
        const password = req.body.password;
        const firstName = req.body.firstName?.trim();
        const lastName = req.body.lastName?.trim();
        if (!username || !email || !password || ! firstName || ! lastName) {
            return res.status(400).send({ error: 'All fields are required' });
        }

        //Checks is username and email are valid
        if (!/^[a-zA-Z0-9]+$/.test(username)) {
            return res.status(422).send({ error: 'Username can only contain letters and numbers' });
        }
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            return res.status(422).send({ error: 'Invalid email format' });
        }

        const existingUser = await User.findOne({ username: req.body.username });
        if (existingUser) {
            return res.status(409).send({ error: 'Username already exists' });
        }

        if (username.length < 3 || username.length > 20) {
            return res.status(422).send({ error: 'Username must be between 3 and 20 characters' });
        }

        const existingEmail = await User.findOne({ email: req.body.email });
        if (existingEmail) {
            return res.status(409).send({ error: 'Email already exists' });
        }

        //Checks password is valid
        if (password.length < 6) {
            return res.status(422).send({ error: 'Password must be at least 6 characters' });
        }

        const user = new User({
            ...req.body,
            username,
            email,
            password,
            firstName,
            lastName,
        });

        await user.save();
        res.status(201).send(user);

    } catch (error) {
        res.status(500).send({ error: `Server Error: ${error.message}` });
    }
});

// Get a user by ID (hides password)
router.get('/id/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//lookup by username
router.get('/username/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username })
            .select('-password');
        if (!user) return res.status(404).json({ message: 'No such user' });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
