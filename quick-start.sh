#!/bin/bash

# WeFuel Platform - Quick Start Script
# For immediate testing and development

echo "🚀 WeFuel Platform - Quick Start"
echo "================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Starting MongoDB..."
    sudo systemctl start mongod
    sudo systemctl enable mongod
fi

# Install dependencies
echo "📦 Installing dependencies..."

echo "Installing frontend dependencies..."
cd wefuel-platform
npm install

echo "Installing backend dependencies..."
cd ../wefuel-backend
npm install

# Create environment file
echo "🔧 Creating environment configuration..."
cat > config.env << EOF
MONGODB_URI=mongodb://localhost:27017/wefuel
PORT=4000
NODE_ENV=development
EOF

# Start backend
echo "🚀 Starting backend server..."
pm2 start index.js --name "wefuel-backend-dev"

# Build and serve frontend
echo "🌐 Building and serving frontend..."
cd ../wefuel-platform
npm run build

# Install serve globally if not installed
if ! command -v serve &> /dev/null; then
    npm install -g serve
fi

# Start frontend
echo "🚀 Starting frontend server..."
pm2 start "serve -s dist -l 3000" --name "wefuel-frontend-dev"

# Show status
echo ""
echo "✅ WeFuel Platform started successfully!"
echo ""
echo "📱 Access your platform:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:4000"
echo ""
echo "🔧 Management commands:"
echo "   View logs: pm2 logs"
echo "   Stop all: pm2 stop all"
echo "   Restart all: pm2 restart all"
echo "   Status: pm2 status"
echo ""
echo "🎉 Your WeFuel platform is now running!" 