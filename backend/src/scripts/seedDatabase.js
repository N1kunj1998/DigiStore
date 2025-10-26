const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const User = require('../models/User');

// Load environment variables
dotenv.config({ path: './config.env' });

// Sample products data - Popular Book Summaries
const sampleProducts = [
  {
    title: "Atomic Habits",
    description: "Transform your life with tiny changes that compound over time",
    fullDescription: "James Clear's #1 New York Times bestseller reveals how small changes can transform your habits and deliver remarkable results. Learn the proven framework for building good habits and breaking bad ones.",
    price: 24.99,
    type: "pdf",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    category: "Self-Help",
    tags: ["habits", "productivity", "self-improvement", "psychology", "behavior"],
    fileUrl: "https://example.com/files/atomic-habits.pdf",
    featured: true
  },
  {
    title: "The 7 Habits of Highly Effective People",
    description: "Timeless principles for personal and professional effectiveness",
    fullDescription: "Stephen Covey's classic guide presents seven fundamental habits that lead to personal and professional success. Learn principles-based living for lasting change and effectiveness.",
    price: 29.99,
    type: "pdf",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
    category: "Self-Help",
    tags: ["effectiveness", "leadership", "personal-development", "success", "principles"],
    fileUrl: "https://example.com/files/7-habits.pdf",
    featured: true
  },
  {
    title: "The Four Agreements",
    description: "A practical guide to personal freedom and happiness",
    fullDescription: "Don Miguel Ruiz reveals the source of self-limiting beliefs that rob us of joy and create needless suffering. Four simple agreements can transform your life.",
    price: 19.99,
    type: "pdf",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
    category: "Self-Help",
    tags: ["freedom", "happiness", "wisdom", "spirituality", "transformation"],
    fileUrl: "https://example.com/files/four-agreements.pdf",
    featured: true
  },
  {
    title: "The Secret",
    description: "Discover the power of positive thinking and manifestation",
    fullDescription: "Rhonda Byrne's groundbreaking book reveals the secret that has been passed down through the ages. Learn how to use the law of attraction to create the life you desire.",
    price: 22.99,
    type: "pdf",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400",
    category: "Self-Help",
    tags: ["manifestation", "positive-thinking", "law-of-attraction", "success", "mindset"],
    fileUrl: "https://example.com/files/the-secret.pdf",
    featured: true
  },
  {
    title: "Deep Work",
    description: "Rules for focused success in a distracted world",
    fullDescription: "Cal Newport argues that the ability to perform deep work is becoming increasingly rare and valuable. Learn how to focus intensely without distraction and produce better results.",
    price: 26.99,
    type: "pdf",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400",
    category: "Productivity",
    tags: ["focus", "productivity", "concentration", "work", "success"],
    fileUrl: "https://example.com/files/deep-work.pdf",
    featured: true
  },
  {
    title: "Think and Grow Rich",
    description: "Napoleon Hill's classic guide to wealth and success",
    fullDescription: "One of the most influential books ever written on achieving success and wealth. Learn the 13 principles that can transform your financial future.",
    price: 21.99,
    type: "pdf",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400",
    category: "Business",
    tags: ["wealth", "success", "money", "mindset", "business"],
    fileUrl: "https://example.com/files/think-and-grow-rich.pdf"
  },
  {
    title: "The Power of Now",
    description: "A guide to spiritual enlightenment",
    fullDescription: "Eckhart Tolle's transformative guide teaches how to live in the present moment and find inner peace. Discover the power of mindfulness and spiritual awakening.",
    price: 23.99,
    type: "pdf",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
    category: "Spirituality",
    tags: ["mindfulness", "enlightenment", "spirituality", "present-moment", "peace"],
    fileUrl: "https://example.com/files/power-of-now.pdf"
  },
  {
    title: "Rich Dad Poor Dad",
    description: "What the rich teach their kids about money",
    fullDescription: "Robert Kiyosaki shares the financial lessons he learned from his two fathers. Learn how to think about money differently and build wealth through smart investing.",
    price: 25.99,
    type: "pdf",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400",
    category: "Finance",
    tags: ["money", "investing", "wealth", "financial-education", "business"],
    fileUrl: "https://example.com/files/rich-dad-poor-dad.pdf"
  },
  // Video Courses
  {
    title: "Master Your Habits - Video Course",
    description: "Complete video course on building lasting habits",
    fullDescription: "A comprehensive video course based on Atomic Habits principles. Learn through step-by-step tutorials, real-world examples, and actionable strategies to transform your life with tiny changes.",
    price: 89.99,
    type: "video",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400",
    category: "Self-Help",
    tags: ["habits", "video-course", "self-improvement", "productivity", "transformation"],
    fileUrl: "https://example.com/videos/master-your-habits-course.mp4",
    featured: true
  },
  {
    title: "7 Habits Masterclass",
    description: "In-depth video training on Stephen Covey's principles",
    fullDescription: "Master the 7 habits through comprehensive video lessons, case studies, and practical exercises. Transform your personal and professional effectiveness with timeless principles.",
    price: 129.99,
    type: "video",
    image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400",
    category: "Leadership",
    tags: ["leadership", "effectiveness", "video-course", "personal-development", "success"],
    fileUrl: "https://example.com/videos/7-habits-masterclass.mp4",
    featured: true
  },
  {
    title: "Deep Work Intensive",
    description: "Master focused work in a distracted world",
    fullDescription: "Learn to perform deep work through structured video lessons, productivity techniques, and concentration strategies. Build the ability to focus intensely and produce exceptional results.",
    price: 99.99,
    type: "video",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400",
    category: "Productivity",
    tags: ["focus", "productivity", "video-course", "concentration", "work"],
    fileUrl: "https://example.com/videos/deep-work-intensive.mp4"
  },
  {
    title: "Manifestation Mastery Course",
    description: "Video course on the law of attraction and manifestation",
    fullDescription: "Discover the power of manifestation through guided video lessons, visualization techniques, and practical exercises. Learn to create the life you desire using proven manifestation methods.",
    price: 79.99,
    type: "video",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
    category: "Spirituality",
    tags: ["manifestation", "law-of-attraction", "video-course", "spirituality", "success"],
    fileUrl: "https://example.com/videos/manifestation-mastery.mp4"
  },
  // Workbooks
  {
    title: "Atomic Habits Workbook",
    description: "Interactive workbook for habit transformation",
    fullDescription: "A comprehensive workbook with exercises, templates, and tracking tools to implement Atomic Habits principles. Includes habit trackers, reflection prompts, and action plans.",
    price: 34.99,
    type: "workbook",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400",
    category: "Self-Help",
    tags: ["habits", "workbook", "self-improvement", "tracking", "exercises"],
    fileUrl: "https://example.com/workbooks/atomic-habits-workbook.pdf",
    featured: true
  },
  {
    title: "7 Habits Personal Workbook",
    description: "Practical workbook for personal effectiveness",
    fullDescription: "Step-by-step workbook with exercises, assessments, and action plans to implement the 7 habits. Includes goal-setting templates, time management tools, and reflection exercises.",
    price: 39.99,
    type: "workbook",
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=400",
    category: "Leadership",
    tags: ["leadership", "workbook", "effectiveness", "goal-setting", "time-management"],
    fileUrl: "https://example.com/workbooks/7-habits-workbook.pdf",
    featured: true
  },
  {
    title: "Deep Work Planner",
    description: "Structured planner for focused work sessions",
    fullDescription: "A comprehensive planner designed for deep work sessions. Includes time-blocking templates, distraction elimination strategies, and productivity tracking tools.",
    price: 29.99,
    type: "workbook",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
    category: "Productivity",
    tags: ["productivity", "workbook", "planning", "focus", "time-management"],
    fileUrl: "https://example.com/workbooks/deep-work-planner.pdf"
  },
  {
    title: "Manifestation Journal",
    description: "Guided journal for manifestation practice",
    fullDescription: "A beautiful journal with guided prompts, visualization exercises, and gratitude practices to support your manifestation journey. Includes daily reflection pages and goal tracking.",
    price: 24.99,
    type: "workbook",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400",
    category: "Spirituality",
    tags: ["manifestation", "workbook", "journaling", "gratitude", "visualization"],
    fileUrl: "https://example.com/workbooks/manifestation-journal.pdf"
  },
  {
    title: "Financial Freedom Workbook",
    description: "Step-by-step guide to building wealth",
    fullDescription: "Practical workbook based on Rich Dad Poor Dad principles. Includes budgeting templates, investment tracking sheets, and wealth-building exercises.",
    price: 32.99,
    type: "workbook",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400",
    category: "Finance",
    tags: ["finance", "workbook", "wealth-building", "investing", "budgeting"],
    fileUrl: "https://example.com/workbooks/financial-freedom-workbook.pdf"
  },
  // Free products
  {
    title: "The Ultimate Productivity Checklist",
    description: "A comprehensive 5-page checklist covering the most effective productivity techniques used by top performers.",
    fullDescription: "Download this free checklist and start implementing proven productivity techniques immediately. Includes time management, focus strategies, and workflow optimization tips.",
    price: 0,
    type: "pdf",
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400",
    category: "Productivity",
    tags: ["productivity", "checklist", "free", "time-management", "focus"],
    fileUrl: "https://example.com/files/ultimate-productivity-checklist.pdf",
    featured: false
  },
  {
    title: "Goal Setting Framework Template",
    description: "A step-by-step template to set and achieve your most important goals using the SMART framework.",
    fullDescription: "This free template will help you set clear, achievable goals using the proven SMART framework. Includes progress tracking sheets and success metrics.",
    price: 0,
    type: "pdf",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    category: "Self-Help",
    tags: ["goals", "template", "free", "smart-framework", "planning"],
    fileUrl: "https://example.com/files/goal-setting-framework.pdf",
    featured: false
  },
  {
    title: "Daily Habit Tracker",
    description: "A simple yet powerful habit tracking system to build consistency and achieve your long-term goals.",
    fullDescription: "Download this free habit tracker and start building the habits that will transform your life. Includes 30-day tracking sheets and habit stacking guide.",
    price: 0,
    type: "pdf",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400",
    category: "Self-Help",
    tags: ["habits", "tracker", "free", "consistency", "self-improvement"],
    fileUrl: "https://example.com/files/daily-habit-tracker.pdf",
    featured: false
  }
];

// Sample users data
const sampleUsers = [
  {
    email: "admin@digistore.com",
    password: "admin123",
    firstName: "Admin",
    lastName: "User",
    isActive: true,
    role: "admin"
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

    // Insert sample users (using create to trigger password hashing)
    const users = [];
    for (const userData of sampleUsers) {
      const user = await User.create(userData);
      users.push(user);
    }
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
