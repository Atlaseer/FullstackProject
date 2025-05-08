//This file will populate the database with some initial dataimport dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from './models/User.js';
import dotenv from 'dotenv';
//import Post from './models/Post.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");

        await User.deleteMany({});
        //await Post.deleteMany({});

        const plainPasswords = ['Simon', 'Oliver', 'Emil', 'Richard', 'Emil', 'Lisa', 'Allen', 'Sarah', 'Michael'];
        const hashedPasswords = await Promise.all(
            plainPasswords.map(pw => bcrypt.hash(pw, 10))
        );


        const users = await User.insertMany([
            { username: 'simonpersson', email: 'simon@mail.com', password: hashedPasswords[0], firstName: 'Simon', lastName: 'Persson', isAdmin: true },
            { username: 'oliverbrantin', email: 'oliver@mail.com', password: hashedPasswords[1], firstName: 'Oliver', lastName: 'Brantin', isAdmin: true },
            { username: 'emiljansson', email: 'emil@mail.com', password: hashedPasswords[2], firstName: 'Emil', lastName: 'Jansson', isAdmin: true },
            { username: 'richardlarlva', email: 'richard@mail.com', password: hashedPasswords[3], firstName: 'Richard', lastName: 'Larlva', isAdmin: true },
            { username: 'emilkerker', email: 'kerker@email.com', password: hashedPasswords[4], firstName: 'Emil', lastName: 'Kerker', isAdmin: true },
            { username: 'lisaningxia', email: 'lisa@mail.com', password: hashedPasswords[5], firstName: 'Lisa', lastName: 'Ningxia', isAdmin: true },
            { username: 'allenstevens', email: 'allen@mail.com', password: hashedPasswords[6], firstName: 'Allen', lastName: 'Stevens', isAdmin: false },
            { username: 'sarahjones', email: 'sarah@mail.com', password: hashedPasswords[7], firstName: 'Sarah', lastName: 'Jones', isAdmin: false },
            { username: 'michaelbrown', email: 'michael@mail.com', password: hashedPasswords[8], firstName: 'Michael', lastName: 'Brown', isAdmin: false },

        ]);

        console.log('Seed data successfully inserted');
        await mongoose.disconnect();
        process.exit();

    } catch (err) {
        console.log("Error seeding data: ", err);
        process.exit(1);
    }
}

seed();
