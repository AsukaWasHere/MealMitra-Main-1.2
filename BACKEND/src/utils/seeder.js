import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';

dotenv.config({ path: './.env' });

import User from '../models/User.js';
import Listing from '../models/Listing.js';

mongoose.connect(process.env.DATABASE_URL);

const generateUsers = (count) => {
  const users = [];
  for (let i = 0; i < count; i++) {
    users.push({
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password: 'password123', 
      role: faker.helpers.arrayElement(['donor', 'receiver']),
    });
  }
  return users;
};

const generateListings = (count, users) => {
  const listings = [];
  const donorUsers = users.filter(user => user.role === 'donor');

  if (donorUsers.length === 0) {
      console.log("No donors found to create listings.");
      return [];
  }

  for (let i = 0; i < count; i++) {
    const randomDonor = faker.helpers.arrayElement(donorUsers);
    
    listings.push({
      title: faker.commerce.productName(),
      description: faker.lorem.sentence(),
      quantity: faker.number.int({ min: 5, max: 20 }),
      location: `${faker.location.streetAddress()}, ${faker.location.city()}`,
      price: faker.number.int({ min: 0, max: 50 }), // Generates a random price
      verified: faker.datatype.boolean(),
      donor: randomDonor._id,
      status: 'available',
    });
  }
  return listings;
};

const importData = async () => {
  try {
    await User.deleteMany();
    await Listing.deleteMany();
    console.log('Previous data destroyed...');

    const createdUsers = await User.insertMany(generateUsers(15));
    console.log('15 mock users created...');

    await Listing.insertMany(generateListings(30, createdUsers));
    console.log('30 mock listings created...');

    console.log('✅ Mock Data Imported Successfully!');
    process.exit();
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

const deleteData = async () => {
  try {
    await User.deleteMany();
    await Listing.deleteMany();
    console.log('✅ Mock Data Destroyed Successfully!');
    process.exit();
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
    console.log("Please use '-i' to import data or '-d' to destroy data.");
    process.exit();
}