const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // Change process.env.MONGO_URI to process.env.DATABASE_URL
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;