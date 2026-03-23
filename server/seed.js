import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/Category.js';
import Question from './models/Question.js';
import { initialCategories, allQuestions } from './data.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/teamgame';

const seed = async () => {
  try {
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected.');

    // Clear existing data (optional, but good for a clean seed)
    console.log('🗑️ Clearing existing data...');
    await Category.deleteMany({});
    await Question.deleteMany({});

    console.log('🌱 Seeding categories...');
    await Category.insertMany(initialCategories);
    console.log(`✅ Seeded ${initialCategories.length} categories.`);

    console.log('🌱 Seeding questions...');
    await Question.insertMany(allQuestions);
    console.log(`✅ Seeded ${allQuestions.length} questions.`);

    console.log('🎉 Database successfully populated!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
};

seed();
