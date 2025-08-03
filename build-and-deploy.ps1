# WeFuel Platform - Build and Deployment Script (PowerShell)
# This script builds and deploys both frontend and backend

param(
    [switch]$Docker,
    [switch]$Help
)

# Configuration
$PROJECT_NAME = "WeFuel Platform"
$FRONTEND_DIR = "wefuel-platform"
$BACKEND_DIR = "wefuel-backend"
$BUILD_DIR = "dist"
$DOCKER_COMPOSE_FILE = "docker-compose.yml"

# Logging functions
function Write-Log {
    param([string]$Message)
    Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠ $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

# Check if Node.js is installed
function Test-NodeJS {
    Write-Log "Checking Node.js installation..."
    try {
        $nodeVersion = node --version
        $nodeMajor = [int]($nodeVersion -replace 'v', '' -split '\.')[0]
        
        if ($nodeMajor -lt 16) {
            Write-Error "Node.js version 16 or higher is required. Current version: $nodeVersion"
            exit 1
        }
        
        Write-Success "Node.js $nodeVersion is installed"
    }
    catch {
        Write-Error "Node.js is not installed. Please install Node.js 16 or higher."
        exit 1
    }
}

# Check if npm is installed
function Test-NPM {
    Write-Log "Checking npm installation..."
    try {
        $npmVersion = npm --version
        Write-Success "npm $npmVersion is installed"
    }
    catch {
        Write-Error "npm is not installed. Please install npm."
        exit 1
    }
}

# Check if Docker is installed (optional)
function Test-Docker {
    Write-Log "Checking Docker installation..."
    try {
        $dockerVersion = docker --version
        Write-Success "Docker $dockerVersion is installed"
        $script:DOCKER_AVAILABLE = $true
    }
    catch {
        Write-Warning "Docker is not installed. Docker deployment will be skipped."
        $script:DOCKER_AVAILABLE = $false
    }
}

# Install frontend dependencies
function Install-FrontendDeps {
    Write-Log "Installing frontend dependencies..."
    Push-Location $FRONTEND_DIR
    
    if (Test-Path "package.json") {
        npm install
        Write-Success "Frontend dependencies installed"
    }
    else {
        Write-Error "package.json not found in $FRONTEND_DIR"
        exit 1
    }
    
    Pop-Location
}

# Install backend dependencies
function Install-BackendDeps {
    Write-Log "Installing backend dependencies..."
    Push-Location $BACKEND_DIR
    
    if (Test-Path "package.json") {
        npm install
        Write-Success "Backend dependencies installed"
    }
    else {
        Write-Error "package.json not found in $BACKEND_DIR"
        exit 1
    }
    
    Pop-Location
}

# Build frontend
function Build-Frontend {
    Write-Log "Building frontend..."
    Push-Location $FRONTEND_DIR
    
    if (Test-Path "package.json") {
        # Check if build script exists
        $scripts = npm run 2>&1
        if ($scripts -match "build") {
            npm run build
            Write-Success "Frontend built successfully"
        }
        else {
            Write-Warning "No build script found, creating standalone version..."
            # Copy standalone HTML if build script doesn't exist
            if (Test-Path "index-standalone.html") {
                if (!(Test-Path $BUILD_DIR)) {
                    New-Item -ItemType Directory -Path $BUILD_DIR | Out-Null
                }
                Copy-Item "index-standalone.html" "$BUILD_DIR/index.html"
                Write-Success "Standalone frontend copied to $BUILD_DIR"
            }
            else {
                Write-Error "No build script or standalone HTML found"
                exit 1
            }
        }
    }
    else {
        Write-Error "package.json not found in $FRONTEND_DIR"
        exit 1
    }
    
    Pop-Location
}

# Test backend
function Test-Backend {
    Write-Log "Testing backend..."
    Push-Location $BACKEND_DIR
    
    # Check if test scripts exist
    if (Test-Path "test-api.js") {
        Write-Log "Running API tests..."
        node test-api.js
    }
    
    if (Test-Path "test-signup-login.js") {
        Write-Log "Running authentication tests..."
        node test-signup-login.js
    }
    
    Write-Success "Backend tests completed"
    Pop-Location
}

# Start backend server
function Start-Backend {
    Write-Log "Starting backend server..."
    Push-Location $BACKEND_DIR
    
    # Check if config.env exists
    if (!(Test-Path "config.env")) {
        Write-Warning "config.env not found, creating default configuration..."
        @"
MONGODB_URI=mongodb://localhost:27017/wefuel
PORT=4000
"@ | Out-File -FilePath "config.env" -Encoding UTF8
    }
    
    # Start backend in background
    $script:BACKEND_PROCESS = Start-Process -FilePath "node" -ArgumentList "index.js" -PassThru -WindowStyle Hidden
    
    # Wait for backend to start
    Start-Sleep -Seconds 5
    
    # Test if backend is running
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:4000/api/health" -UseBasicParsing -TimeoutSec 10
        Write-Success "Backend server started on port 4000"
    }
    catch {
        Write-Error "Backend server failed to start"
        if ($script:BACKEND_PROCESS) {
            Stop-Process -Id $script:BACKEND_PROCESS.Id -Force -ErrorAction SilentlyContinue
        }
        exit 1
    }
    
    Pop-Location
}

# Start frontend development server
function Start-Frontend {
    Write-Log "Starting frontend development server..."
    Push-Location $FRONTEND_DIR
    
    if (Test-Path "package.json") {
        # Check if dev script exists
        $scripts = npm run 2>&1
        if ($scripts -match "dev") {
            $script:FRONTEND_PROCESS = Start-Process -FilePath "npm" -ArgumentList "run", "dev" -PassThru -WindowStyle Hidden
            Start-Sleep -Seconds 3
            Write-Success "Frontend development server started on port 5173"
        }
        else {
            Write-Warning "No dev script found, serving static files..."
            # Serve static files if no dev script
            if (Test-Path $BUILD_DIR) {
                Push-Location $BUILD_DIR
                $script:FRONTEND_PROCESS = Start-Process -FilePath "python" -ArgumentList "-m", "http.server", "5173" -PassThru -WindowStyle Hidden
                Write-Success "Static file server started on port 5173"
                Pop-Location
            }
            else {
                Write-Error "No build directory found"
                exit 1
            }
        }
    }
    else {
        Write-Error "package.json not found in $FRONTEND_DIR"
        exit 1
    }
    
    Pop-Location
}

# Build Docker images
function Build-Docker {
    if (-not $script:DOCKER_AVAILABLE) {
        Write-Warning "Skipping Docker build (Docker not available)"
        return
    }
    
    Write-Log "Building Docker images..."
    
    # Build backend image
    if (Test-Path "$BACKEND_DIR/Dockerfile") {
        docker build -t wefuel-backend $BACKEND_DIR
        Write-Success "Backend Docker image built"
    }
    else {
        Write-Warning "Backend Dockerfile not found"
    }
    
    # Build frontend image
    if (Test-Path "$FRONTEND_DIR/Dockerfile") {
        docker build -t wefuel-frontend $FRONTEND_DIR
        Write-Success "Frontend Docker image built"
    }
    else {
        Write-Warning "Frontend Dockerfile not found"
    }
}

# Deploy with Docker Compose
function Deploy-Docker {
    if (-not $script:DOCKER_AVAILABLE) {
        Write-Warning "Skipping Docker deployment (Docker not available)"
        return
    }
    
    if (!(Test-Path $DOCKER_COMPOSE_FILE)) {
        Write-Warning "docker-compose.yml not found, skipping Docker deployment"
        return
    }
    
    Write-Log "Deploying with Docker Compose..."
    docker-compose up -d
    Write-Success "Docker deployment completed"
}

# Health check
function Test-Health {
    Write-Log "Performing health checks..."
    
    # Check backend health
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:4000/api/health" -UseBasicParsing -TimeoutSec 10
        Write-Success "Backend health check passed"
    }
    catch {
        Write-Error "Backend health check failed"
    }
    
    # Check frontend (if running)
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing -TimeoutSec 10
        Write-Success "Frontend health check passed"
    }
    catch {
        Write-Warning "Frontend health check failed (may not be running)"
    }
}

# Cleanup function
function Stop-Services {
    Write-Log "Stopping services..."
    
    # Stop backend process
    if ($script:BACKEND_PROCESS) {
        Stop-Process -Id $script:BACKEND_PROCESS.Id -Force -ErrorAction SilentlyContinue
    }
    
    # Stop frontend process
    if ($script:FRONTEND_PROCESS) {
        Stop-Process -Id $script:FRONTEND_PROCESS.Id -Force -ErrorAction SilentlyContinue
    }
    
    Write-Success "Services stopped"
}

# Show help
function Show-Help {
    Write-Host "Usage: .\build-and-deploy.ps1 [OPTIONS]"
    Write-Host ""
    Write-Host "Options:"
    Write-Host "  -Docker    Deploy with Docker Compose"
    Write-Host "  -Help      Show this help message"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  .\build-and-deploy.ps1              # Build and start services locally"
    Write-Host "  .\build-and-deploy.ps1 -Docker      # Build and deploy with Docker"
}

# Main execution
function Main {
    Write-Host "=================================" -ForegroundColor Blue
    Write-Host "  $PROJECT_NAME" -ForegroundColor Blue
    Write-Host "  Build and Deployment Script" -ForegroundColor Blue
    Write-Host "=================================" -ForegroundColor Blue
    Write-Host ""
    
    # Set up cleanup on script exit
    Register-EngineEvent PowerShell.Exiting -Action { Stop-Services }
    
    # Check prerequisites
    Test-NodeJS
    Test-NPM
    Test-Docker
    
    # Install dependencies
    Install-FrontendDeps
    Install-BackendDeps
    
    # Build and test
    Build-Frontend
    Test-Backend
    
    # Build Docker images
    Build-Docker
    
    # Start services
    Start-Backend
    Start-Frontend
    
    # Health checks
    Test-Health
    
    # Deploy with Docker (optional)
    if ($Docker) {
        Deploy-Docker
    }
    
    Write-Host ""
    Write-Host "=================================" -ForegroundColor Green
    Write-Host "  Deployment Summary" -ForegroundColor Green
    Write-Host "=================================" -ForegroundColor Green
    Write-Host "Backend API: http://localhost:4000" -ForegroundColor Blue
    Write-Host "Frontend:    http://localhost:5173" -ForegroundColor Blue
    Write-Host "Health Check: http://localhost:4000/api/health" -ForegroundColor Blue
    Write-Host ""
    Write-Host "Press Ctrl+C to stop all services" -ForegroundColor Yellow
    
    # Keep script running
    try {
        while ($true) {
            Start-Sleep -Seconds 1
        }
    }
    catch {
        Write-Host "`nStopping services..." -ForegroundColor Yellow
        Stop-Services
    }
}

# Parse command line arguments
if ($Help) {
    Show-Help
    exit 0
}

# Run main function
Main 