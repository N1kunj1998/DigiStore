const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const User = require('../models/User');

// Load environment variables
dotenv.config({ path: './config.env' });

// Sample products data
const sampleProducts = [
  {
    title: "The Lean Startup",
    description: "A comprehensive guide to building successful startups",
    fullDescription: "Eric Ries's revolutionary approach to building and managing successful startups in an age when companies need to innovate more than ever.",
    price: 29.99,
    type: "pdf",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
    category: "Business",
    tags: ["startup", "business", "entrepreneurship", "innovation"],
    fileUrl: "https://example.com/files/lean-startup.pdf"
  },
  {
    title: "Atomic Habits",
    description: "Transform your life with tiny changes",
    fullDescription: "James Clear's #1 New York Times bestseller reveals how small changes can transform your habits and deliver remarkable results.",
    price: 24.99,
    type: "pdf",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    category: "Self-Help",
    tags: ["habits", "productivity", "self-improvement", "psychology"],
    fileUrl: "https://example.com/files/atomic-habits.pdf"
  },
  {
    title: "React Mastery Course",
    description: "Complete React development course",
    fullDescription: "Learn React from scratch with hands-on projects, modern hooks, and best practices for building scalable applications.",
    price: 199.99,
    type: "video",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400",
    category: "Programming",
    tags: ["react", "javascript", "frontend", "web-development"],
    fileUrl: "https://example.com/videos/react-mastery-course.mp4"
  },
  {
    title: "JavaScript Fundamentals",
    description: "Master JavaScript from basics to advanced",
    fullDescription: "Comprehensive JavaScript course covering ES6+, async programming, DOM manipulation, and modern development practices.",
    price: 149.99,
    type: "video",
    image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400",
    category: "Programming",
    tags: ["javascript", "programming", "web-development", "es6"],
    fileUrl: "https://example.com/videos/javascript-fundamentals.mp4"
  },
  {
    title: "Productivity Workbook",
    description: "Interactive workbook for productivity improvement",
    fullDescription: "A comprehensive workbook with exercises, templates, and strategies to boost your productivity and time management skills.",
    price: 19.99,
    type: "workbook",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400",
    category: "Productivity",
    tags: ["productivity", "time-management", "workbook", "self-improvement"],
    fileUrl: "https://example.com/workbooks/productivity-workbook.pdf"
  },
  {
    title: "Design Thinking Workbook",
    description: "Creative problem-solving workbook",
    fullDescription: "Step-by-step workbook for applying design thinking principles to solve complex problems and drive innovation.",
    price: 34.99,
    type: "workbook",
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=400",
    category: "Design",
    tags: ["design-thinking", "creativity", "problem-solving", "innovation"],
    fileUrl: "https://example.com/workbooks/design-thinking-workbook.pdf"
  },
  {
    title: "Digital Marketing Mastery",
    description: "Complete digital marketing course",
    fullDescription: "Learn digital marketing strategies, SEO, social media marketing, content marketing, and analytics.",
    price: 179.99,
    type: "video",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400",
    category: "Marketing",
    tags: ["digital-marketing", "seo", "social-media", "content-marketing"],
    fileUrl: "https://example.com/videos/digital-marketing-mastery.mp4"
  },
  {
    title: "Python for Data Science",
    description: "Data science with Python programming",
    fullDescription: "Master Python for data science, including pandas, numpy, matplotlib, and machine learning libraries.",
    price: 229.99,
    type: "video",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400",
    category: "Data Science",
    tags: ["python", "data-science", "machine-learning", "programming"],
    fileUrl: "https://example.com/videos/python-data-science.mp4"
  }
];

// Sample users data
const sampleUsers = [
  {
    email: "admin@digistore.com",
    password: "admin123",
    firstName: "Admin",
    lastName: "User",
    isActive: true
  },
  {
    email: "john.doe@example.com",
    password: "password123",
    firstName: "John",
    lastName: "Doe",
    isActive: true
  },
  {
    email: "jane.smith@example.com",
    password: "password123",
    firstName: "Jane",
    lastName: "Smith",
    isActive: true
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/digistore');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');

    // Insert sample products
    const products = await Product.insertMany(sampleProducts);
    console.log(`Inserted ${products.length} products`);

    // Insert sample users
    const users = await User.insertMany(sampleUsers);
    console.log(`Inserted ${users.length} users`);

    console.log('Database seeded successfully!');
    console.log('\nSample data created:');
    console.log('- Products:', products.length);
    console.log('- Users:', users.length);
    console.log('\nYou can now test the API endpoints.');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the seeding function
seedDatabase();
