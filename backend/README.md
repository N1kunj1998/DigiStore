# DigiStore Backend API

A comprehensive Node.js + Express + MongoDB backend API for the DigiStore e-commerce platform.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with bcrypt password hashing
- **Product Management**: CRUD operations for digital products
- **Shopping Cart**: In-memory cart management (Redis recommended for production)
- **Order Processing**: Complete order lifecycle with Stripe payment integration
- **Lead Management**: Lead capture and tracking system
- **Analytics**: Comprehensive analytics and reporting
- **File Management**: Secure file upload and download system
- **Rate Limiting**: API rate limiting for security
- **Input Validation**: Request validation with express-validator
- **Error Handling**: Centralized error handling middleware

## 🛠 Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + bcrypt
- **Payment**: Stripe
- **File Storage**: Cloudinary (optional)
- **Email**: Nodemailer
- **Security**: Helmet, CORS, Rate Limiting

## 📋 Prerequisites

- Node.js 18+
- MongoDB (local or cloud)
- Stripe account (for payments)
- Cloudinary account (for file uploads, optional)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy the environment file and update the values:

```bash
cp env.example config.env
```

Update `config.env` with your actual values:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/digistore

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### 3. Start MongoDB

Make sure MongoDB is running on your local machine:

```bash
# Start MongoDB (if using local installation)
mongod

# Or if using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 4. Seed Database (Optional)

```bash
npm run seed
```

### 5. Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:5000`

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Product Endpoints

- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get single product
- `GET /api/products/search` - Search products
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Cart Endpoints

- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:itemId` - Update cart item
- `DELETE /api/cart/remove/:itemId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart

### Order Endpoints

- `POST /api/orders` - Create order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders/payment` - Process payment
- `PUT /api/orders/:id/status` - Update order status (admin)

### Lead Endpoints

- `POST /api/leads` - Create lead (public)
- `GET /api/leads` - Get leads (admin)
- `GET /api/leads/stats` - Get lead statistics (admin)
- `GET /api/leads/:id` - Get single lead (admin)
- `PUT /api/leads/:id/status` - Update lead status (admin)

### Analytics Endpoints

- `GET /api/analytics/overview` - Get analytics overview (admin)
- `GET /api/analytics/sales` - Get sales analytics (admin)
- `GET /api/analytics/products` - Get product analytics (admin)
- `GET /api/analytics/users` - Get user analytics (admin)

## 🔧 Development Scripts

```bash
# Development
npm run dev          # Start development server with nodemon

# Production
npm run build        # Build TypeScript to JavaScript
npm start           # Start production server

# Database
npm run seed        # Seed database with sample data

# Testing
npm test           # Run tests
```

## 🗄 Database Schema

### Users Collection
```javascript
{
  email: String (unique),
  password: String (hashed),
  firstName: String,
  lastName: String,
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Products Collection
```javascript
{
  title: String,
  description: String,
  fullDescription: String,
  price: Number,
  type: String (pdf|video|workbook),
  image: String,
  fileUrl: String,
  category: String,
  tags: [String],
  isActive: Boolean,
  downloadCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Orders Collection
```javascript
{
  userId: ObjectId,
  items: [{
    productId: ObjectId,
    title: String,
    price: Number,
    type: String
  }],
  total: Number,
  status: String (pending|completed|failed|cancelled),
  paymentId: String,
  paymentMethod: String,
  billingAddress: {
    firstName: String,
    lastName: String,
    email: String,
    address: String,
    city: String,
    zipCode: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Leads Collection
```javascript
{
  email: String,
  firstName: String,
  lastName: String,
  company: String,
  phone: String,
  interests: [String],
  source: String,
  productId: String,
  productTitle: String,
  status: String (new|contacted|nurturing|converted),
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Validation**: Comprehensive request validation
- **CORS**: Cross-origin resource sharing configuration
- **Helmet**: Security headers
- **Error Handling**: Secure error messages

## 🚀 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/digistore
JWT_SECRET=your-production-jwt-secret
STRIPE_SECRET_KEY=sk_live_your_live_stripe_key
FRONTEND_URL=https://your-frontend-domain.com
```

### Recommended Hosting Platforms

- **Vercel**: Easy deployment with serverless functions
- **Railway**: Simple deployment with database
- **DigitalOcean**: VPS with full control
- **Heroku**: Platform-as-a-Service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@digistore.com or create an issue in the repository.

