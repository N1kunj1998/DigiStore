# DigiStore - Digital Products E-commerce Platform

A modern e-commerce platform for selling digital products like book summaries, video courses, and workbooks.

## Features

- 🛒 **Shopping Cart**: Add/remove products with persistent cart
- 👤 **User Authentication**: Email/password registration and login
- 📱 **Responsive Design**: Mobile-first design with Tailwind CSS
- 🎯 **Lead Capture**: Newsletter subscription and lead magnet popup
- 📊 **Analytics**: Built-in analytics tracking
- 🔍 **Search & Filter**: Product search and filtering capabilities
- 💳 **Payment Ready**: Stripe integration ready
- 📦 **Product Types**: Support for PDFs, videos, and workbooks

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Query** for data fetching
- **Sonner** for toast notifications

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcrypt** for password hashing
- **CORS** enabled for cross-origin requests

## Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB (local or cloud)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/N1kunj1998/DigiStore.git
   cd DigiStore
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Set up environment variables**
   
   **Frontend** (create `.env` in root):
   ```env
   VITE_API_URL=http://localhost:3001/api
   ```
   
   **Backend** (copy `backend/env.example` to `backend/config.env`):
   ```env
   PORT=3001
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/digistore
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:5173
   ```

5. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

6. **Seed the database**
   ```bash
   cd backend
   node src/scripts/seedDatabase.js
   ```

7. **Start the development servers**
   
   **Backend** (Terminal 1):
   ```bash
   cd backend
   npm run dev
   ```
   
   **Frontend** (Terminal 2):
   ```bash
   npm run dev
   ```

8. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001/api

## Deployment

### Netlify Deployment (Frontend)

This project includes a GitHub Actions workflow for automatic deployment to Netlify.

#### Setup Steps:

1. **Create a Netlify site**
   - Go to [Netlify](https://netlify.com)
   - Create a new site from Git
   - Connect your GitHub repository

2. **Get Netlify credentials**
   - Go to Netlify Dashboard → Site Settings → Identity
   - Generate a new Personal Access Token
   - Note your Site ID from Site Settings → General

3. **Add GitHub Secrets**
   Go to your GitHub repository → Settings → Secrets and variables → Actions
   
   Add these secrets:
   - `NETLIFY_AUTH_TOKEN`: Your Netlify Personal Access Token
   - `NETLIFY_SITE_ID`: Your Netlify Site ID
   - `VITE_API_URL`: Your production API URL (e.g., `https://your-api.herokuapp.com/api`)

4. **Deploy**
   - Push to the `main` branch
   - GitHub Actions will automatically build and deploy to Netlify

### Backend Deployment

For backend deployment, consider:
- **Heroku**: Easy Node.js deployment
- **Railway**: Modern deployment platform
- **DigitalOcean App Platform**: Scalable hosting
- **AWS/GCP**: Enterprise solutions

## Project Structure

```
DigiStore/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── contexts/          # React contexts
│   ├── services/          # API services
│   └── lib/               # Utilities
├── backend/               # Backend source code
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   ├── middleware/    # Custom middleware
│   │   └── scripts/      # Database scripts
│   └── config.env        # Environment variables
├── .github/
│   └── workflows/        # GitHub Actions
└── dist/                 # Built frontend (generated)
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get single product
- `GET /api/products/search` - Search products

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:productId` - Update cart item
- `DELETE /api/cart/:productId` - Remove from cart
- `DELETE /api/cart` - Clear cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the documentation
- Review the code comments

---

**Happy coding! 🚀**