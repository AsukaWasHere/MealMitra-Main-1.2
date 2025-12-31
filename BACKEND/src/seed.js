import mongoose from "mongoose";
import dotenv from "dotenv";
import Listing from "./models/Listing.js"; 
import User from "./models/User.js"; 
import { fakerEN_IN as faker } from "@faker-js/faker"; 

dotenv.config();

const indianLocations = [
  "Connaught Place, New Delhi, Delhi, India",
  "Koramangala 5th Block, Bengaluru, Karnataka, India",
  "Marine Drive, Mumbai, Maharashtra, India",
  "Sector 18, Noida, Uttar Pradesh, India",
  "Park Street, Kolkata, West Bengal, India",
  "Hitech City, Hyderabad, Telangana, India",
  "T. Nagar, Chennai, Tamil Nadu, India",
  "Viman Nagar, Pune, Maharashtra, India",
  "Indirapuram, Ghaziabad, Uttar Pradesh, India",
  "Bani Park, Jaipur, Rajasthan, India"
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("✅ Connected to DB...");

    await Listing.deleteMany({});
    await User.deleteMany({}); 

    const donors = [];
    for (let i = 0; i < 5; i++) {
      donors.push({
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        password: "password123", 
        role: "donor",
      });
    }
    const createdDonors = await User.insertMany(donors);

    const listings = [];
    const foodItems = ["Paneer Butter Masala", "Dal Makhani", "Veg Biryani", "Samosas"];

    for (let i = 0; i < 15; i++) {
      listings.push({
        title: faker.helpers.arrayElement(foodItems),              
        donor: faker.helpers.arrayElement(createdDonors)._id, 
        description: "Freshly prepared meal ready for collection.",
        quantity: faker.number.int({ min: 1, max: 15 }),
        location: faker.helpers.arrayElement(indianLocations), // Real geocodable address
        price: faker.number.float({ min: 20, max: 300, fractionDigits: 2 }), 
        imageUrl: `https://loremflickr.com/320/240/food,indian?lock=${i}`, 
        quality: "Good Quality",
        status: "available",
      });
    }

    await Listing.insertMany(listings);
    console.log("🚀 Seeded successfully with REAL Indian addresses!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedData();