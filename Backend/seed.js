import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';
dotenv.config();

import User from './models/user.model.js';

const NUM_USERS = 50;

const seedDatabase = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      throw new Error('MONGO_URI is not defined in your .env file');
    }
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully.');

    console.log('Deleting existing user data...');
    await User.deleteMany({});
    console.log('Emptying existing users collection completed.');

    const usersToCreate = [];

    for (let i = 0; i < NUM_USERS; i++) {
      const fakeUser = {
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        role: faker.helpers.arrayElement(['admin', 'user', 'moderator']),
        status: faker.helpers.arrayElement(['active', 'banned', 'pending']),
        creationDate: faker.date.past({ years: 2 }),
      };
      usersToCreate.push(fakeUser);
    }

    await User.insertMany(usersToCreate);
    console.log(`Successfully seeded ${usersToCreate.length} users.`);

  } catch (error) {
    console.error('Error seeding the database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
};

seedDatabase();
