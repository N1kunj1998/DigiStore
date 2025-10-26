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
    fullDescription: `James Clear's #1 New York Times bestseller "Atomic Habits" reveals how small changes can transform your habits and deliver remarkable results. This comprehensive guide provides a proven framework for building good habits and breaking bad ones.

**What You'll Learn:**
• The science behind habit formation and why small changes create big results
• The 4-step process for building better habits: Cue, Craving, Response, Reward
• How to design your environment to make good habits inevitable
• Strategies for breaking bad habits and replacing them with positive ones
• The compound effect: how 1% improvements lead to remarkable transformations
• Identity-based habits: changing who you are, not just what you do
• Advanced tactics for maintaining motivation and overcoming setbacks

**Key Concepts Covered:**
- The Habit Loop: Understanding the neurological patterns behind every habit
- Environment Design: Making good habits obvious, attractive, easy, and satisfying
- The Two-Minute Rule: Starting new habits with minimal effort
- Habit Stacking: Linking new habits to existing routines
- Temptation Bundling: Pairing activities you want to do with activities you need to do

**Perfect For:**
- Anyone looking to build better habits and break bad ones
- Professionals seeking to improve productivity and performance
- Students wanting to develop effective study habits
- Individuals pursuing personal development and self-improvement
- Entrepreneurs building systems for long-term success

**Real-World Applications:**
This summary includes practical examples and case studies showing how individuals have used these principles to lose weight, build businesses, learn new skills, and achieve their goals. You'll discover how to apply these concepts to your specific situation and create lasting change.

**Bonus Content:**
- Habit tracking templates and worksheets
- Common habit formation mistakes and how to avoid them
- Advanced strategies for habit maintenance
- Troubleshooting guide for when habits don't stick

Transform your life one small habit at a time with this essential guide to behavior change.`,
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
    fullDescription: `Stephen Covey's revolutionary book "The 7 Habits of Highly Effective People" presents a principle-centered approach for solving personal and professional problems. This comprehensive guide offers a framework for living with fairness, integrity, honesty, and human dignity.

**The 7 Habits Framework:**

**Private Victory (Habits 1-3):**
1. **Be Proactive** - Take responsibility for your life and choices
2. **Begin with the End in Mind** - Define your personal mission and vision
3. **Put First Things First** - Prioritize based on importance, not urgency

**Public Victory (Habits 4-6):**
4. **Think Win-Win** - Seek mutual benefit in all human interactions
5. **Seek First to Understand, Then to Be Understood** - Practice empathic communication
6. **Synergize** - Create innovative solutions through teamwork

**Renewal (Habit 7):**
7. **Sharpen the Saw** - Balance and renew your resources, energy, and health

**What You'll Master:**
• Character ethics vs. personality ethics
• The maturity continuum: dependence → independence → interdependence
• Time management matrix and prioritization techniques
• Effective communication and listening skills
• Leadership principles and team building
• Conflict resolution and negotiation strategies
• Personal mission statement development
• Goal setting and achievement frameworks

**Key Concepts Explored:**
- Paradigm shifts and how they change our perception
- The Circle of Influence vs. Circle of Concern
- Emotional bank account and relationship building
- Win-win agreements and performance agreements
- The four dimensions of renewal: physical, mental, spiritual, social

**Perfect For:**
- Leaders and managers seeking to improve their effectiveness
- Individuals wanting to develop strong character and integrity
- Teams looking to enhance collaboration and synergy
- Anyone pursuing personal and professional growth
- Students of leadership and management

**Real-World Applications:**
This summary includes practical exercises, case studies, and real-world examples showing how these principles have transformed organizations, relationships, and individual lives. Learn how to apply these timeless principles in your daily interactions and long-term planning.

**Bonus Materials:**
- Personal mission statement templates
- Time management worksheets
- Communication skill exercises
- Leadership assessment tools
- Goal-setting frameworks

Transform your approach to life and work with these proven principles of effectiveness.`,
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
    fullDescription: `Cal Newport's groundbreaking book "Deep Work" argues that the ability to perform deep work is becoming increasingly rare and valuable in our distracted world. This comprehensive guide teaches you how to focus intensely without distraction and produce better results.

**What is Deep Work?**
Deep work is professional activities performed in a state of distraction-free concentration that push your cognitive capabilities to their limit. These efforts create new value, improve your skill, and are hard to replicate.

**The Four Philosophies of Deep Work:**
1. **Monastic Philosophy** - Eliminate or minimize shallow obligations
2. **Bimodal Philosophy** - Divide your time between deep work and everything else
3. **Rhythmic Philosophy** - Create a routine of regular deep work sessions
4. **Journalistic Philosophy** - Fit deep work wherever you can into your schedule

**Core Principles You'll Master:**
• The neuroscience of attention and focus
• How to eliminate distractions and create focus-friendly environments
• Time-blocking techniques for deep work sessions
• The importance of boredom and embracing mental challenges
• How to measure and track your deep work progress
• Strategies for maintaining focus in an always-connected world
• The economic value of deep work in the knowledge economy

**Practical Strategies Covered:**
- Digital minimalism and technology detox techniques
- Creating distraction-free workspaces
- Building deep work rituals and routines
- Managing email and shallow work obligations
- Using downtime for mental restoration
- Developing concentration stamina through practice
- Balancing deep work with collaboration needs

**The Deep Work Rules:**
1. **Work Deeply** - Schedule deep work and protect this time
2. **Embrace Boredom** - Train your mind to resist distraction
3. **Quit Social Media** - Evaluate tools based on their benefits vs. harms
4. **Drain the Shallows** - Minimize shallow work and optimize schedules

**Perfect For:**
- Knowledge workers seeking to maximize their productivity
- Students wanting to improve their study and learning efficiency
- Entrepreneurs building businesses that require intense focus
- Creatives and artists looking to enhance their creative output
- Professionals in competitive fields where quality matters

**Real-World Applications:**
This summary includes case studies of successful individuals who have mastered deep work, practical exercises for building focus, and step-by-step guides for implementing deep work principles in various professional contexts.

**Bonus Content:**
- Deep work scheduling templates
- Distraction elimination checklists
- Focus-building exercises and meditation techniques
- Technology detox protocols
- Productivity measurement tools

Transform your work habits and achieve extraordinary results through the power of deep, focused work.`,
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
