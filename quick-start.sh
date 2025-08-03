#!/bin/bash

# WeFuel Platform - Quick Start Script
# This script provides multiple options to start the platform

echo "================================="
echo "  WeFuel Platform Quick Start"
echo "================================="
echo ""

# Check if Node.js is available
if command -v node &> /dev/null; then
    NODE_AVAILABLE=true
    echo "✓ Node.js is available"
else
    NODE_AVAILABLE=false
    echo "⚠ Node.js not found - will use standalone version"
fi

echo ""
echo "Choose your deployment option:"
echo "1. Standalone HTML (No Node.js required)"
echo "2. Full Stack Development (Node.js required)"
echo "3. Production Build (Node.js required)"
echo "4. Docker Deployment (Docker required)"
echo "5. Exit"
echo ""

read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo ""
        echo "Starting Standalone HTML Version..."
        echo "Opening: wefuel-platform/index-standalone.html"
        
        if command -v xdg-open &> /dev/null; then
            xdg-open wefuel-platform/index-standalone.html
        elif command -v open &> /dev/null; then
            open wefuel-platform/index-standalone.html
        elif command -v start &> /dev/null; then
            start wefuel-platform/index-standalone.html
        else
            echo "Please manually open: wefuel-platform/index-standalone.html"
        fi
        
        echo "✓ Standalone version launched!"
        echo "Features available:"
        echo "  - Interactive user type selection"
        echo "  - Sample data and UI components"
        echo "  - Responsive design"
        ;;
        
    2)
        if [ "$NODE_AVAILABLE" = false ]; then
            echo "❌ Node.js is required for full stack development"
            echo "Please install Node.js 16+ and try again"
            exit 1
        fi
        
        echo ""
        echo "Starting Full Stack Development..."
        echo "This will start both backend and frontend servers"
        echo ""
        
        # Check if MongoDB is running
        if ! command -v mongosh &> /dev/null; then
            echo "⚠ MongoDB not found. Please ensure MongoDB is installed and running."
            echo "You can still test the frontend, but backend features won't work."
            echo ""
        fi
        
        # Start backend in background
        echo "Starting backend server..."
        cd wefuel-backend
        if [ -f "package.json" ]; then
            npm install --silent
            npm start &
            BACKEND_PID=$!
            echo "✓ Backend started (PID: $BACKEND_PID)"
        else
            echo "❌ Backend package.json not found"
            exit 1
        fi
        cd ..
        
        # Wait for backend to start
        sleep 3
        
        # Start frontend
        echo "Starting frontend development server..."
        cd wefuel-platform
        if [ -f "package.json" ]; then
            npm install --silent
            npm run dev &
            FRONTEND_PID=$!
            echo "✓ Frontend started (PID: $FRONTEND_PID)"
        else
            echo "❌ Frontend package.json not found"
            kill $BACKEND_PID 2>/dev/null || true
            exit 1
        fi
        cd ..
        
        echo ""
        echo "================================="
        echo "  Development Servers Started"
        echo "================================="
        echo "Backend API: http://localhost:4000"
        echo "Frontend:    http://localhost:5173"
        echo "Health Check: http://localhost:4000/api/health"
        echo ""
        echo "Press Ctrl+C to stop all servers"
        
        # Wait for user to stop
        trap "echo ''; echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true; echo 'Servers stopped'; exit" INT
        wait
        ;;
        
    3)
        if [ "$NODE_AVAILABLE" = false ]; then
            echo "❌ Node.js is required for production build"
            echo "Please install Node.js 16+ and try again"
            exit 1
        fi
        
        echo ""
        echo "Building for Production..."
        echo ""
        
        # Build frontend
        echo "Building frontend..."
        cd wefuel-platform
        if [ -f "package.json" ]; then
            npm install --silent
            npm run build
            echo "✓ Frontend built successfully"
        else
            echo "❌ Frontend package.json not found"
            exit 1
        fi
        cd ..
        
        # Start backend
        echo "Starting backend server..."
        cd wefuel-backend
        if [ -f "package.json" ]; then
            npm install --silent
            npm start &
            BACKEND_PID=$!
            echo "✓ Backend started (PID: $BACKEND_PID)"
        else
            echo "❌ Backend package.json not found"
            exit 1
        fi
        cd ..
        
        echo ""
        echo "================================="
        echo "  Production Build Ready"
        echo "================================="
        echo "Backend API: http://localhost:4000"
        echo "Frontend:    wefuel-platform/dist/ (serve with nginx/apache)"
        echo ""
        echo "To serve the frontend, you can:"
        echo "  - Use nginx/apache to serve wefuel-platform/dist/"
        echo "  - Use: python3 -m http.server 8080 (in dist folder)"
        echo "  - Use: npm install -g serve && serve wefuel-platform/dist/"
        echo ""
        echo "Press Ctrl+C to stop backend server"
        
        trap "echo ''; echo 'Stopping backend...'; kill $BACKEND_PID 2>/dev/null || true; echo 'Backend stopped'; exit" INT
        wait
        ;;
        
    4)
        if ! command -v docker &> /dev/null; then
            echo "❌ Docker is required for Docker deployment"
            echo "Please install Docker and try again"
            exit 1
        fi
        
        echo ""
        echo "Starting Docker Deployment..."
        echo ""
        
        if [ -f "docker-compose.yml" ]; then
            docker-compose up -d
            echo "✓ Docker deployment started"
            echo ""
            echo "Services:"
            echo "  - Frontend: http://localhost:80"
            echo "  - Backend:  http://localhost:4000"
            echo ""
            echo "To stop: docker-compose down"
        else
            echo "❌ docker-compose.yml not found"
            echo "Please ensure Docker configuration is set up"
            exit 1
        fi
        ;;
        
    5)
        echo "Goodbye!"
        exit 0
        ;;
        
    *)
        echo "Invalid choice. Please run the script again."
        exit 1
        ;;
esac 