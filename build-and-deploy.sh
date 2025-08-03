#!/bin/bash

# WeFuel Platform - Build and Deployment Script
# This script builds and deploys both frontend and backend

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="WeFuel Platform"
FRONTEND_DIR="wefuel-platform"
BACKEND_DIR="wefuel-backend"
BUILD_DIR="dist"
DOCKER_COMPOSE_FILE="docker-compose.yml"

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✓${NC} $1"
}

warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if Node.js is installed
check_nodejs() {
    log "Checking Node.js installation..."
    if ! command -v node &> /dev/null; then
        error "Node.js is not installed. Please install Node.js 16 or higher."
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 16 ]; then
        error "Node.js version 16 or higher is required. Current version: $(node --version)"
        exit 1
    fi
    
    success "Node.js $(node --version) is installed"
}

# Check if npm is installed
check_npm() {
    log "Checking npm installation..."
    if ! command -v npm &> /dev/null; then
        error "npm is not installed. Please install npm."
        exit 1
    fi
    
    success "npm $(npm --version) is installed"
}

# Check if Docker is installed (optional)
check_docker() {
    log "Checking Docker installation..."
    if command -v docker &> /dev/null; then
        success "Docker $(docker --version) is installed"
        DOCKER_AVAILABLE=true
    else
        warning "Docker is not installed. Docker deployment will be skipped."
        DOCKER_AVAILABLE=false
    fi
}

# Install frontend dependencies
install_frontend_deps() {
    log "Installing frontend dependencies..."
    cd "$FRONTEND_DIR"
    
    if [ -f "package.json" ]; then
        npm install
        success "Frontend dependencies installed"
    else
        error "package.json not found in $FRONTEND_DIR"
        exit 1
    fi
    
    cd ..
}

# Install backend dependencies
install_backend_deps() {
    log "Installing backend dependencies..."
    cd "$BACKEND_DIR"
    
    if [ -f "package.json" ]; then
        npm install
        success "Backend dependencies installed"
    else
        error "package.json not found in $BACKEND_DIR"
        exit 1
    fi
    
    cd ..
}

# Build frontend
build_frontend() {
    log "Building frontend..."
    cd "$FRONTEND_DIR"
    
    if [ -f "package.json" ]; then
        # Check if build script exists
        if npm run | grep -q "build"; then
            npm run build
            success "Frontend built successfully"
        else
            warning "No build script found, creating standalone version..."
            # Copy standalone HTML if build script doesn't exist
            if [ -f "index-standalone.html" ]; then
                mkdir -p "$BUILD_DIR"
                cp index-standalone.html "$BUILD_DIR/index.html"
                success "Standalone frontend copied to $BUILD_DIR"
            else
                error "No build script or standalone HTML found"
                exit 1
            fi
        fi
    else
        error "package.json not found in $FRONTEND_DIR"
        exit 1
    fi
    
    cd ..
}

# Test backend
test_backend() {
    log "Testing backend..."
    cd "$BACKEND_DIR"
    
    # Check if test scripts exist
    if [ -f "test-api.js" ]; then
        log "Running API tests..."
        node test-api.js
    fi
    
    if [ -f "test-signup-login.js" ]; then
        log "Running authentication tests..."
        node test-signup-login.js
    fi
    
    success "Backend tests completed"
    cd ..
}

# Start backend server
start_backend() {
    log "Starting backend server..."
    cd "$BACKEND_DIR"
    
    # Check if config.env exists
    if [ ! -f "config.env" ]; then
        warning "config.env not found, creating default configuration..."
        cat > config.env << EOF
MONGODB_URI=mongodb://localhost:27017/wefuel
PORT=4000
EOF
    fi
    
    # Start backend in background
    npm start &
    BACKEND_PID=$!
    
    # Wait for backend to start
    sleep 5
    
    # Test if backend is running
    if curl -s http://localhost:4000/api/health > /dev/null; then
        success "Backend server started on port 4000"
    else
        error "Backend server failed to start"
        kill $BACKEND_PID 2>/dev/null || true
        exit 1
    fi
    
    cd ..
}

# Start frontend development server
start_frontend() {
    log "Starting frontend development server..."
    cd "$FRONTEND_DIR"
    
    if [ -f "package.json" ]; then
        # Check if dev script exists
        if npm run | grep -q "dev"; then
            npm run dev &
            FRONTEND_PID=$!
            sleep 3
            success "Frontend development server started on port 5173"
        else
            warning "No dev script found, serving static files..."
            # Serve static files if no dev script
            if [ -d "$BUILD_DIR" ]; then
                cd "$BUILD_DIR"
                python3 -m http.server 5173 &
                FRONTEND_PID=$!
                success "Static file server started on port 5173"
                cd ..
            else
                error "No build directory found"
                exit 1
            fi
        fi
    else
        error "package.json not found in $FRONTEND_DIR"
        exit 1
    fi
    
    cd ..
}

# Build Docker images
build_docker() {
    if [ "$DOCKER_AVAILABLE" = false ]; then
        warning "Skipping Docker build (Docker not available)"
        return
    fi
    
    log "Building Docker images..."
    
    # Build backend image
    if [ -f "$BACKEND_DIR/Dockerfile" ]; then
        docker build -t wefuel-backend "$BACKEND_DIR"
        success "Backend Docker image built"
    else
        warning "Backend Dockerfile not found"
    fi
    
    # Build frontend image
    if [ -f "$FRONTEND_DIR/Dockerfile" ]; then
        docker build -t wefuel-frontend "$FRONTEND_DIR"
        success "Frontend Docker image built"
    else
        warning "Frontend Dockerfile not found"
    fi
}

# Deploy with Docker Compose
deploy_docker() {
    if [ "$DOCKER_AVAILABLE" = false ]; then
        warning "Skipping Docker deployment (Docker not available)"
        return
    fi
    
    if [ ! -f "$DOCKER_COMPOSE_FILE" ]; then
        warning "docker-compose.yml not found, skipping Docker deployment"
        return
    fi
    
    log "Deploying with Docker Compose..."
    docker-compose up -d
    success "Docker deployment completed"
}

# Health check
health_check() {
    log "Performing health checks..."
    
    # Check backend health
    if curl -s http://localhost:4000/api/health > /dev/null; then
        success "Backend health check passed"
    else
        error "Backend health check failed"
    fi
    
    # Check frontend (if running)
    if curl -s http://localhost:5173 > /dev/null; then
        success "Frontend health check passed"
    else
        warning "Frontend health check failed (may not be running)"
    fi
}

# Cleanup function
cleanup() {
    log "Cleaning up..."
    
    # Kill background processes
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    
    success "Cleanup completed"
}

# Main execution
main() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  $PROJECT_NAME${NC}"
    echo -e "${BLUE}  Build and Deployment Script${NC}"
    echo -e "${BLUE}================================${NC}"
    echo ""
    
    # Set up cleanup on script exit
    trap cleanup EXIT
    
    # Check prerequisites
    check_nodejs
    check_npm
    check_docker
    
    # Install dependencies
    install_frontend_deps
    install_backend_deps
    
    # Build and test
    build_frontend
    test_backend
    
    # Build Docker images
    build_docker
    
    # Start services
    start_backend
    start_frontend
    
    # Health checks
    health_check
    
    # Deploy with Docker (optional)
    if [ "$1" = "--docker" ]; then
        deploy_docker
    fi
    
    echo ""
    echo -e "${GREEN}================================${NC}"
    echo -e "${GREEN}  Deployment Summary${NC}"
    echo -e "${GREEN}================================${NC}"
    echo -e "Backend API: ${BLUE}http://localhost:4000${NC}"
    echo -e "Frontend:    ${BLUE}http://localhost:5173${NC}"
    echo -e "Health Check: ${BLUE}http://localhost:4000/api/health${NC}"
    echo ""
    echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
    
    # Keep script running
    wait
}

# Parse command line arguments
case "$1" in
    "--docker")
        main "$1"
        ;;
    "--help"|"-h")
        echo "Usage: $0 [OPTIONS]"
        echo ""
        echo "Options:"
        echo "  --docker    Deploy with Docker Compose"
        echo "  --help, -h  Show this help message"
        echo ""
        echo "Examples:"
        echo "  $0              # Build and start services locally"
        echo "  $0 --docker     # Build and deploy with Docker"
        ;;
    "")
        main
        ;;
    *)
        error "Unknown option: $1"
        echo "Use --help for usage information"
        exit 1
        ;;
esac 