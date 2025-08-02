#!/bin/bash

# WeFuel Platform - Linux Testing Script
# Complete testing setup including repository cloning

set -e  # Exit on any error

echo "🧪 WeFuel Platform - Linux Testing Script"
echo "=========================================="

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

# Create testing directory
TEST_DIR="$HOME/wefuel-test"
print_status "Creating testing directory: $TEST_DIR"
mkdir -p $TEST_DIR
cd $TEST_DIR

# Check if repository already exists
if [ -d "wefuel-platform" ] || [ -d "wefuel-backend" ]; then
    print_warning "Repository already exists. Updating..."
    if [ -d "wefuel-platform" ]; then
        cd wefuel-platform
        git pull origin main
        cd ..
    fi
    if [ -d "wefuel-backend" ]; then
        cd wefuel-backend
        git pull origin main
        cd ..
    fi
else
    print_status "Cloning WeFuel repository..."
    
    # Option 1: Clone from GitHub (if you have a public repo)
    # git clone https://github.com/yourusername/wefuel-platform.git
    # git clone https://github.com/yourusername/wefuel-backend.git
    
    # Option 2: Copy from local development (current approach)
    print_status "Copying project files from current directory..."
    
    # Get the directory where this script is located
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    
    if [ -d "$SCRIPT_DIR/wefuel-platform" ]; then
        cp -r "$SCRIPT_DIR/wefuel-platform" .
        print_success "Frontend copied successfully"
    else
        print_error "Frontend directory not found at $SCRIPT_DIR/wefuel-platform"
        exit 1
    fi
    
    if [ -d "$SCRIPT_DIR/wefuel-backend" ]; then
        cp -r "$SCRIPT_DIR/wefuel-backend" .
        print_success "Backend copied successfully"
    else
        print_error "Backend directory not found at $SCRIPT_DIR/wefuel-backend"
        exit 1
    fi
fi

# Check system requirements
print_status "Checking system requirements..."

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Installing Node.js 18..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    NODE_VERSION=$(node --version)
    print_success "Node.js is installed: $NODE_VERSION"
fi

# Check npm
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
else
    NPM_VERSION=$(npm --version)
    print_success "npm is installed: $NPM_VERSION"
fi

# Check MongoDB
if ! command -v mongod &> /dev/null; then
    print_warning "MongoDB is not installed. Installing MongoDB..."
    wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
    sudo apt-get update
    sudo apt-get install -y mongodb-org
    sudo systemctl start mongod
    sudo systemctl enable mongod
    print_success "MongoDB installed and started"
else
    print_success "MongoDB is installed"
    # Start MongoDB if not running
    if ! pgrep -x "mongod" > /dev/null; then
        print_status "Starting MongoDB..."
        sudo systemctl start mongod
    fi
fi

# Check PM2
if ! command -v pm2 &> /dev/null; then
    print_status "Installing PM2..."
    sudo npm install -g pm2
    print_success "PM2 installed"
else
    print_success "PM2 is installed"
fi

# Install frontend dependencies
print_status "Installing frontend dependencies..."
cd wefuel-platform
npm install
print_success "Frontend dependencies installed"

# Build frontend
print_status "Building frontend..."
npm run build
print_success "Frontend built successfully"

# Install backend dependencies
print_status "Installing backend dependencies..."
cd ../wefuel-backend
npm install
print_success "Backend dependencies installed"

# Create environment file for backend
print_status "Creating backend environment file..."
cat > config.env << EOF
MONGODB_URI=mongodb://localhost:27017/wefuel-test
PORT=4000
NODE_ENV=development
EOF

# Start backend with PM2
print_status "Starting backend server..."
pm2 start index.js --name "wefuel-backend-test"
pm2 save

# Start frontend with PM2
print_status "Starting frontend server..."
cd ../wefuel-platform
pm2 start "npx serve -s dist -l 3000" --name "wefuel-frontend-test"
pm2 save

# Create test data script
print_status "Creating test data script..."
cat > ../test-data.js << 'EOF'
const mongoose = require('mongoose');

// Connect to test database
mongoose.connect('mongodb://localhost:27017/wefuel-test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Test user data
const testUsers = [
    {
        email: 'test@wefuel.com',
        phone: '+27 82 123 4567',
        card: '1234567890123456',
        password: 'test123',
        wallet: 1000,
        type: 'customer'
    },
    {
        email: 'driver@wefuel.com',
        phone: '+27 83 234 5678',
        card: '2345678901234567',
        password: 'driver123',
        wallet: 500,
        type: 'driver'
    },
    {
        email: 'station@wefuel.com',
        phone: '+27 84 345 6789',
        card: '3456789012345678',
        password: 'station123',
        wallet: 2000,
        type: 'station'
    }
];

// Test order data
const testOrders = [
    {
        userId: 'test-user-id',
        fuelLitres: 50,
        storeItems: ['Oil Filter', 'Air Filter'],
        total: 1250.00,
        status: 'pending',
        createdAt: new Date()
    }
];

// Test transaction data
const testTransactions = [
    {
        userId: 'test-user-id',
        type: 'deposit',
        amount: 1000,
        desc: 'Initial deposit',
        date: new Date()
    }
];

async function createTestData() {
    try {
        const db = mongoose.connection;
        
        // Clear existing data
        await db.collection('users').deleteMany({});
        await db.collection('orders').deleteMany({});
        await db.collection('transactions').deleteMany({});
        
        // Insert test data
        await db.collection('users').insertMany(testUsers);
        await db.collection('orders').insertMany(testOrders);
        await db.collection('transactions').insertMany(testTransactions);
        
        console.log('✅ Test data created successfully!');
        console.log('📊 Test Users:');
        testUsers.forEach(user => {
            console.log(`   - ${user.email} (${user.type})`);
        });
        
    } catch (error) {
        console.error('❌ Error creating test data:', error);
    } finally {
        mongoose.connection.close();
    }
}

createTestData();
EOF

# Run test data creation
print_status "Creating test data..."
cd ../wefuel-backend
node ../test-data.js

# Create testing guide
print_status "Creating testing guide..."
cat > ../TESTING-GUIDE.md << 'EOF'
# 🧪 WeFuel Platform - Testing Guide

## 🚀 Quick Start

Your WeFuel platform is now running for testing!

### Access URLs:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **Demo Page**: http://localhost:3000 (main page)

### Test Accounts:
- **Customer**: test@wefuel.com / test123
- **Driver**: driver@wefuel.com / driver123
- **Station**: station@wefuel.com / station123

## 📱 Testing Different User Types

### 1. Customer Testing
1. Go to http://localhost:3000
2. Click "Customer" to switch to customer view
3. Test pages:
   - **Fuel Order**: http://localhost:3000/order
   - **Wallet**: http://localhost:3000/wallet
   - **Track Order**: http://localhost:3000/track

### 2. Driver Testing
1. Go to http://localhost:3000
2. Click "Driver" to switch to driver view
3. Test pages:
   - **Training**: http://localhost:3000/driver/training
   - **Deliveries**: http://localhost:3000/driver/deliveries
   - **Earnings**: http://localhost:3000/driver/earnings
   - **Referrals**: http://localhost:3000/driver/referrals

### 3. Station Testing
1. Go to http://localhost:3000
2. Click "Station" to switch to station view
3. Test pages:
   - **Dashboard**: http://localhost:3000/station/dashboard
   - **Inventory**: http://localhost:3000/station/inventory
   - **Orders**: http://localhost:3000/station/orders
   - **Reports**: http://localhost:3000/station/reports

### 4. Admin Testing
1. Go to http://localhost:3000
2. Click "Admin" to switch to admin view
3. Test pages:
   - **Dashboard**: http://localhost:3000/admin/dashboard
   - **User Management**: http://localhost:3000/admin/users
   - **System Settings**: http://localhost:3000/admin/settings

## 🔧 API Testing

### Test API Endpoints:
```bash
# Health check
curl http://localhost:4000/api/health

# Get users
curl http://localhost:4000/api/users

# Test signup
curl -X POST http://localhost:4000/api/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"newuser@test.com","password":"test123","phone":"+27 85 123 4567","card":"1234567890123456"}'

# Test login
curl -X POST http://localhost:4000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@wefuel.com","password":"test123"}'
```

## 🛠️ Management Commands

### Service Management:
```bash
# Check status
pm2 status

# View logs
pm2 logs wefuel-backend-test
pm2 logs wefuel-frontend-test

# Restart services
pm2 restart wefuel-backend-test
pm2 restart wefuel-frontend-test

# Stop all services
pm2 stop all
pm2 delete all
```

### Database Management:
```bash
# Access MongoDB shell
mongosh wefuel-test

# View collections
show collections

# View users
db.users.find()

# View orders
db.orders.find()
```

## 🧪 Automated Testing

### Run Backend Tests:
```bash
cd wefuel-backend
npm run test-signup-login
npm run test-api
```

### Frontend Testing:
```bash
cd wefuel-platform
npm test
```

## 🐛 Troubleshooting

### Common Issues:

1. **Port already in use**
   ```bash
   sudo netstat -tulpn | grep :3000
   sudo netstat -tulpn | grep :4000
   ```

2. **MongoDB connection issues**
   ```bash
   sudo systemctl status mongod
   sudo systemctl restart mongod
   ```

3. **PM2 process issues**
   ```bash
   pm2 delete all
   pm2 start ecosystem.config.js
   ```

4. **Frontend build issues**
   ```bash
   cd wefuel-platform
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

## 📊 Performance Testing

### Load Testing:
```bash
# Install Apache Bench
sudo apt install apache2-utils

# Test API endpoints
ab -n 100 -c 10 http://localhost:4000/api/health
ab -n 100 -c 10 http://localhost:3000/
```

### Memory Usage:
```bash
# Check PM2 memory usage
pm2 monit

# Check system resources
htop
free -h
```

## 🎯 Test Scenarios

### 1. User Registration Flow
1. Test unique email constraint
2. Test unique phone constraint
3. Test card limit (max 3 accounts)
4. Test FICA verification

### 2. Order Flow
1. Create fuel order
2. Calculate pricing
3. Process payment
4. Track delivery

### 3. Driver Operations
1. Complete training modules
2. Take quiz (80% pass requirement)
3. Accept deliveries
4. Update delivery status

### 4. Station Operations
1. View dashboard metrics
2. Manage inventory
3. Process orders
4. Generate reports

### 5. Admin Operations
1. Monitor platform metrics
2. Manage users
3. Configure system settings
4. Handle approvals

## ✅ Success Criteria

- [ ] All 16 pages load correctly
- [ ] Navigation works between user types
- [ ] API endpoints respond properly
- [ ] Database operations work
- [ ] Forms submit successfully
- [ ] Responsive design works on mobile
- [ ] No console errors
- [ ] Performance is acceptable

## 📞 Support

If you encounter issues:
1. Check the logs: `pm2 logs`
2. Verify services: `pm2 status`
3. Test connectivity: `curl http://localhost:4000/api/health`
4. Check database: `mongosh wefuel-test`

---

**🎉 Happy Testing!**
EOF

# Show final status
print_success "🎉 WeFuel Platform testing setup completed!"
echo ""
echo "📱 Access your platform:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:4000"
echo ""
echo "🔧 Management commands:"
echo "   View status: pm2 status"
echo "   View logs: pm2 logs"
echo "   Stop all: pm2 stop all"
echo "   Restart all: pm2 restart all"
echo ""
echo "📖 Testing guide: $TEST_DIR/TESTING-GUIDE.md"
echo ""
echo "🧪 Test Accounts:"
echo "   Customer: test@wefuel.com / test123"
echo "   Driver: driver@wefuel.com / driver123"
echo "   Station: station@wefuel.com / station123"
echo ""
echo "🎯 Start testing at: http://localhost:3000" 