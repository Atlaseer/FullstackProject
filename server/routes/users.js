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
        if (!username || !email) {
            return res.status(400).send({ error: 'Username and email are required' });
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
        res.status(500).send({error: `Server Error: ${error.message}`});
    }
});

export default router;
