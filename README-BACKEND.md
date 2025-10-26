# DigiStore - Complete E-commerce Platform

A full-stack digital products e-commerce platform built with React + TypeScript frontend and Node.js + Express + MongoDB backend.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or cloud)
- Git

### 1. Clone and Setup Backend

```bash
# Navigate to your project directory
cd DigiStore

# Run the setup script
./setup-backend.sh

# Or manually:
cd backend
npm install
cp config.env .env
# Update .env with your values
```

### 2. Start MongoDB

**Option A: Local Installation**
```bash
mongod
```

**Option B: Docker**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 3. Seed Database (Optional)

```bash
cd backend
npm run seed
```

This creates:
- Sample products
- Test user accounts (admin@digistore.com / admin123, demo@digistore.com / demo123)

### 4. Start Backend Server

```bash
cd backend
npm run dev
```

Backend will be available at `http://localhost:5000`

### 5. Start Frontend

```bash
# In a new terminal
npm run dev
```

Frontend will be available at `http://localhost:5173`

## 🏗 Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Context API
- **Routing**: React Router v6
- **HTTP Client**: Fetch API with custom service layer
- **Authentication**: JWT tokens stored in localStorage

### Backend (Node.js + Express + MongoDB)
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + bcrypt
- **Payment**: Stripe integration
- **File Storage**: Cloudinary (optional)
- **Security**: Helmet, CORS, Rate Limiting

## 📁 Project Structure

```
DigiStore/
├── backend/                 # Backend API
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # Database models
│   │   ├── routes/          # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── scripts/        # Database seeding
│   │   └── server.ts       # Main server file
│   ├── package.json
│   └── README.md
├── src/                    # Frontend React app
│   ├── components/         # React components
│   ├── contexts/           # React contexts
│   ├── services/           # API services
│   ├── pages/              # Route pages
│   └── main.tsx
└── README.md
```

## 🔧 Environment Configuration

### Backend (.env)
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/digistore

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# Stripe (for payments)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Features

### ✅ Implemented Features

#### Authentication & User Management
- User registration and login
- JWT-based authentication
- Password hashing with bcrypt
- User profile management
- Protected routes

#### Product Management
- Product CRUD operations
- Product categories and filtering
- Search functionality
- Product types (PDF, Video, Workbook)
- Image upload support

#### Shopping Cart
- Add/remove items from cart
- Update quantities
- Persistent cart (backend storage)
- Real-time cart updates

#### Order Processing
- Order creation and management
- Stripe payment integration
- Order status tracking
- Billing address management

#### Lead Management
- Lead capture forms
- Lead tracking and analytics
- Lead status management
- Email collection

#### Analytics Dashboard
- Sales analytics
- User analytics
- Product performance
- Lead conversion tracking

### 🔄 API Endpoints

#### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

#### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `GET /api/products/search` - Search products
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

#### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:itemId` - Update cart item
- `DELETE /api/cart/remove/:itemId` - Remove item
- `DELETE /api/cart/clear` - Clear cart

#### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders/payment` - Process payment

#### Leads
- `POST /api/leads` - Create lead (public)
- `GET /api/leads` - Get leads (admin)
- `GET /api/leads/stats` - Get lead statistics
- `PUT /api/leads/:id/status` - Update lead status

#### Analytics
- `GET /api/analytics/overview` - Analytics overview
- `GET /api/analytics/sales` - Sales analytics
- `GET /api/analytics/products` - Product analytics
- `GET /api/analytics/users` - User analytics

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

### Backend Deployment

**Option 1: Railway**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

**Option 2: Vercel**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

**Option 3: DigitalOcean**
```bash
# Build the project
npm run build

# Upload dist folder to your server
# Set up PM2 for process management
pm2 start dist/server.js --name digistore-api
```

### Frontend Deployment

**Vercel (Recommended)**
```bash
# Connect your GitHub repository to Vercel
# Deploy automatically on push to main branch
```

**Netlify**
```bash
npm run build
# Upload dist folder to Netlify
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
npm test
```

## 📊 Monitoring & Analytics

- **Health Check**: `GET /api/health`
- **Error Logging**: Console logging with error tracking
- **Performance**: Response time monitoring
- **Analytics**: Built-in analytics dashboard

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

## 🎯 Next Steps

### Immediate Setup
1. ✅ Backend API created
2. ✅ Frontend integration ready
3. ✅ Database models defined
4. ✅ Authentication system implemented
5. ✅ Payment integration ready

### To Complete Setup
1. Update environment variables with your actual values
2. Start MongoDB
3. Run database seeding
4. Start both frontend and backend servers
5. Test the complete flow

### Future Enhancements
- [ ] Email notifications
- [ ] File upload system
- [ ] Admin dashboard
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] Multi-language support

