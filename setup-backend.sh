#!/bin/bash

echo "🚀 Setting up DigiStore Backend..."

# Navigate to backend directory
cd backend

# Install dependencies
echo "📦 Installing backend dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp config.env .env
    echo "✅ Created .env file. Please update it with your actual values."
else
    echo "✅ .env file already exists."
fi

# Check if MongoDB is running
echo "🔍 Checking MongoDB connection..."
if command -v mongosh &> /dev/null; then
    if mongosh --eval "db.runCommand('ping')" --quiet > /dev/null 2>&1; then
        echo "✅ MongoDB is running and accessible."
    else
        echo "⚠️  MongoDB is not running. Please start MongoDB first:"
        echo "   - If using local installation: mongod"
        echo "   - If using Docker: docker run -d -p 27017:27017 --name mongodb mongo:latest"
    fi
else
    echo "⚠️  MongoDB client not found. Please install MongoDB or use Docker."
fi

echo ""
echo "🎉 Backend setup complete!"
echo ""
echo "Next steps:"
echo "1. Update the .env file with your actual values"
echo "2. Start MongoDB if not already running"
echo "3. Run 'npm run seed' to populate the database with sample data"
echo "4. Run 'npm run dev' to start the development server"
echo ""
echo "The backend will be available at http://localhost:5000"
echo "API documentation will be available at http://localhost:5000/api/health"

