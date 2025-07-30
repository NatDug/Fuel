#!/bin/bash

# WeFuel Platform - Linux Deployment Script
# This script sets up the complete WeFuel platform on a Linux machine

set -e  # Exit on any error

echo "🚀 WeFuel Platform - Linux Deployment Script"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root"
   exit 1
fi

# Update system packages
print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js and npm
print_status "Installing Node.js and npm..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    print_success "Node.js installed successfully"
else
    print_warning "Node.js is already installed"
fi

# Install MongoDB
print_status "Installing MongoDB..."
if ! command -v mongod &> /dev/null; then
    wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
    sudo apt-get update
    sudo apt-get install -y mongodb-org
    sudo systemctl start mongod
    sudo systemctl enable mongod
    print_success "MongoDB installed and started successfully"
else
    print_warning "MongoDB is already installed"
fi

# Install PM2 for process management
print_status "Installing PM2..."
sudo npm install -g pm2

# Install nginx
print_status "Installing nginx..."
sudo apt install -y nginx

# Create deployment directory
DEPLOY_DIR="/opt/wefuel"
print_status "Creating deployment directory: $DEPLOY_DIR"
sudo mkdir -p $DEPLOY_DIR
sudo chown $USER:$USER $DEPLOY_DIR

# Copy project files
print_status "Copying project files..."
cp -r wefuel-platform $DEPLOY_DIR/
cp -r wefuel-backend $DEPLOY_DIR/

# Install frontend dependencies
print_status "Installing frontend dependencies..."
cd $DEPLOY_DIR/wefuel-platform
npm install

# Build frontend
print_status "Building frontend..."
npm run build

# Install backend dependencies
print_status "Installing backend dependencies..."
cd $DEPLOY_DIR/wefuel-backend
npm install

# Create environment file for backend
print_status "Creating backend environment file..."
cat > $DEPLOY_DIR/wefuel-backend/config.env << EOF
MONGODB_URI=mongodb://localhost:27017/wefuel
PORT=4000
NODE_ENV=production
EOF

# Create PM2 ecosystem file
print_status "Creating PM2 ecosystem file..."
cat > $DEPLOY_DIR/ecosystem.config.js << EOF
module.exports = {
  apps: [
    {
      name: 'wefuel-backend',
      cwd: '$DEPLOY_DIR/wefuel-backend',
      script: 'index.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 4000
      }
    }
  ]
};
EOF

# Start backend with PM2
print_status "Starting backend with PM2..."
cd $DEPLOY_DIR
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Configure nginx
print_status "Configuring nginx..."
sudo tee /etc/nginx/sites-available/wefuel << EOF
server {
    listen 80;
    server_name _;

    # Frontend
    location / {
        root $DEPLOY_DIR/wefuel-platform/dist;
        try_files \$uri \$uri/ /index.html;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
EOF

# Enable nginx site
sudo ln -sf /etc/nginx/sites-available/wefuel /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx

# Create deployment script
print_status "Creating deployment update script..."
cat > $DEPLOY_DIR/deploy-update.sh << 'EOF'
#!/bin/bash

# WeFuel Platform - Update Deployment Script

set -e

DEPLOY_DIR="/opt/wefuel"
BACKUP_DIR="/opt/wefuel/backups/$(date +%Y%m%d_%H%M%S)"

echo "🔄 Updating WeFuel Platform..."

# Create backup
mkdir -p $BACKUP_DIR
cp -r $DEPLOY_DIR/wefuel-platform $BACKUP_DIR/
cp -r $DEPLOY_DIR/wefuel-backend $BACKUP_DIR/

# Update frontend
cd $DEPLOY_DIR/wefuel-platform
git pull origin main
npm install
npm run build

# Update backend
cd $DEPLOY_DIR/wefuel-backend
git pull origin main
npm install

# Restart services
pm2 restart wefuel-backend
sudo systemctl reload nginx

echo "✅ WeFuel Platform updated successfully!"
echo "📁 Backup created at: $BACKUP_DIR"
EOF

chmod +x $DEPLOY_DIR/deploy-update.sh

# Create service status script
print_status "Creating service status script..."
cat > $DEPLOY_DIR/status.sh << 'EOF'
#!/bin/bash

echo "🔍 WeFuel Platform Status"
echo "========================"

echo -e "\n📊 PM2 Status:"
pm2 status

echo -e "\n🌐 Nginx Status:"
sudo systemctl status nginx --no-pager -l

echo -e "\n🗄️  MongoDB Status:"
sudo systemctl status mongod --no-pager -l

echo -e "\n📁 Deployment Directory:"
ls -la /opt/wefuel/

echo -e "\n🌍 Frontend Build:"
ls -la /opt/wefuel/wefuel-platform/dist/

echo -e "\n🔧 Backend Files:"
ls -la /opt/wefuel/wefuel-backend/
EOF

chmod +x $DEPLOY_DIR/status.sh

# Create firewall configuration
print_status "Configuring firewall..."
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

print_success "🎉 WeFuel Platform deployment completed successfully!"
echo ""
echo "📋 Next Steps:"
echo "1. Access your platform at: http://your-server-ip"
echo "2. Check status: $DEPLOY_DIR/status.sh"
echo "3. Update platform: $DEPLOY_DIR/deploy-update.sh"
echo "4. View logs: pm2 logs wefuel-backend"
echo ""
echo "🔧 Useful Commands:"
echo "- Restart backend: pm2 restart wefuel-backend"
echo "- Restart nginx: sudo systemctl restart nginx"
echo "- View nginx logs: sudo tail -f /var/log/nginx/error.log"
echo "- View app logs: pm2 logs wefuel-backend"
echo ""
echo "📁 Deployment Directory: $DEPLOY_DIR" 