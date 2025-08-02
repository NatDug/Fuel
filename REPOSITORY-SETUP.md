# 📁 WeFuel Platform - Repository Setup Guide

This guide covers how to set up the WeFuel platform repository on your Linux machine for testing.

## 🚀 Quick Setup Options

### Option 1: Automated Testing Script (Recommended)

```bash
# Make the script executable
chmod +x test-linux.sh

# Run the complete testing setup
./test-linux.sh
```

This will automatically:
- ✅ Copy project files to `~/wefuel-test/`
- ✅ Install all dependencies
- ✅ Set up MongoDB
- ✅ Start both frontend and backend
- ✅ Create test data
- ✅ Generate testing guide

### Option 2: Manual Repository Setup

#### Step 1: Clone/Copy Repository

```bash
# Create testing directory
mkdir -p ~/wefuel-test
cd ~/wefuel-test

# Option A: Copy from current development directory
cp -r /path/to/your/wefuel-platform .
cp -r /path/to/your/wefuel-backend .

# Option B: Clone from Git (if you have a repository)
# git clone https://github.com/yourusername/wefuel-platform.git
# git clone https://github.com/yourusername/wefuel-backend.git
```

#### Step 2: Install Dependencies

```bash
# Install frontend dependencies
cd wefuel-platform
npm install
npm run build

# Install backend dependencies
cd ../wefuel-backend
npm install
```

#### Step 3: Setup Database

```bash
# Install MongoDB (if not already installed)
sudo apt update
sudo apt install -y mongodb

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Create test database
mongosh
use wefuel-test
exit
```

#### Step 4: Configure Environment

```bash
# Create backend environment file
cd wefuel-backend
cat > config.env << EOF
MONGODB_URI=mongodb://localhost:27017/wefuel-test
PORT=4000
NODE_ENV=development
EOF
```

#### Step 5: Start Services

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start backend
cd wefuel-backend
pm2 start index.js --name "wefuel-backend-test"

# Start frontend
cd ../wefuel-platform
pm2 start "npx serve -s dist -l 3000" --name "wefuel-frontend-test"

# Save PM2 configuration
pm2 save
```

## 🔧 Repository Structure

After setup, your directory structure should look like:

```
~/wefuel-test/
├── wefuel-platform/          # Frontend React application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # All 16 platform pages
│   │   ├── App.tsx          # Main routing configuration
│   │   └── main.tsx         # Application entry point
│   ├── dist/                # Built frontend files
│   ├── package.json         # Frontend dependencies
│   └── README.md           # Frontend documentation
├── wefuel-backend/          # Backend Node.js application
│   ├── models/             # MongoDB schemas
│   ├── index.js            # Express server and API routes
│   ├── config.env          # Environment configuration
│   ├── package.json        # Backend dependencies
│   └── README.md           # Backend documentation
├── test-data.js            # Test data creation script
├── TESTING-GUIDE.md        # Comprehensive testing guide
└── deploy-linux.sh         # Production deployment script
```

## 🧪 Testing the Repository

### 1. **Verify Installation**

```bash
# Check if services are running
pm2 status

# Check if ports are accessible
curl http://localhost:3000
curl http://localhost:4000/api/health

# Check database connection
mongosh wefuel-test --eval "db.stats()"
```

### 2. **Access the Platform**

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **Demo Page**: http://localhost:3000 (main page)

### 3. **Test Different User Types**

1. **Customer Portal**: http://localhost:3000/order
2. **Driver Portal**: http://localhost:3000/driver/training
3. **Station Portal**: http://localhost:3000/station/dashboard
4. **Admin Portal**: http://localhost:3000/admin/dashboard

## 🔄 Repository Updates

### Update from Git (if using Git)

```bash
cd ~/wefuel-test/wefuel-platform
git pull origin main
npm install
npm run build

cd ../wefuel-backend
git pull origin main
npm install

# Restart services
pm2 restart all
```

### Update from Local Development

```bash
# Copy updated files
cp -r /path/to/updated/wefuel-platform ~/wefuel-test/
cp -r /path/to/updated/wefuel-backend ~/wefuel-test/

# Reinstall and rebuild
cd ~/wefuel-test/wefuel-platform
npm install
npm run build

cd ../wefuel-backend
npm install

# Restart services
pm2 restart all
```

## 🛠️ Development Workflow

### 1. **Local Development**

```bash
# Start development servers
cd wefuel-platform
npm run dev  # Frontend development server

cd ../wefuel-backend
npm run dev  # Backend development server
```

### 2. **Testing Changes**

```bash
# Build and test changes
cd wefuel-platform
npm run build

cd ../wefuel-backend
pm2 restart wefuel-backend-test

cd ../wefuel-platform
pm2 restart wefuel-frontend-test
```

### 3. **Database Management**

```bash
# Access MongoDB shell
mongosh wefuel-test

# View collections
show collections

# View data
db.users.find()
db.orders.find()
db.transactions.find()

# Clear test data
db.users.deleteMany({})
db.orders.deleteMany({})
db.transactions.deleteMany({})
```

## 🐛 Troubleshooting Repository Issues

### Common Problems and Solutions

#### 1. **Repository Not Found**

```bash
# Check if directories exist
ls -la ~/wefuel-test/

# Re-copy if missing
cp -r /path/to/wefuel-platform ~/wefuel-test/
cp -r /path/to/wefuel-backend ~/wefuel-test/
```

#### 2. **Dependencies Installation Issues**

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 3. **Build Failures**

```bash
# Check Node.js version
node --version  # Should be 18+

# Check for TypeScript errors
cd wefuel-platform
npx tsc --noEmit

# Check for missing dependencies
npm ls
```

#### 4. **Database Connection Issues**

```bash
# Check MongoDB status
sudo systemctl status mongod

# Restart MongoDB
sudo systemctl restart mongod

# Check connection string
cat wefuel-backend/config.env
```

#### 5. **Port Conflicts**

```bash
# Check what's using the ports
sudo netstat -tulpn | grep :3000
sudo netstat -tulpn | grep :4000

# Kill conflicting processes
sudo kill -9 <PID>
```

## 📊 Repository Health Check

### Run Health Check Script

```bash
# Create health check script
cat > ~/wefuel-test/health-check.sh << 'EOF'
#!/bin/bash

echo "🔍 WeFuel Repository Health Check"
echo "================================="

# Check directories
echo "📁 Checking directories..."
if [ -d "wefuel-platform" ]; then
    echo "✅ Frontend directory exists"
else
    echo "❌ Frontend directory missing"
fi

if [ -d "wefuel-backend" ]; then
    echo "✅ Backend directory exists"
else
    echo "❌ Backend directory missing"
fi

# Check services
echo "🔧 Checking services..."
pm2 status

# Check ports
echo "🌐 Checking ports..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend accessible"
else
    echo "❌ Frontend not accessible"
fi

if curl -s http://localhost:4000/api/health > /dev/null; then
    echo "✅ Backend accessible"
else
    echo "❌ Backend not accessible"
fi

# Check database
echo "🗄️ Checking database..."
if mongosh wefuel-test --eval "db.stats()" > /dev/null 2>&1; then
    echo "✅ Database accessible"
else
    echo "❌ Database not accessible"
fi

echo "🎉 Health check completed!"
EOF

chmod +x ~/wefuel-test/health-check.sh
./health-check.sh
```

## 🎯 Repository Testing Checklist

- [ ] Repository files copied/cloned successfully
- [ ] All dependencies installed
- [ ] Frontend builds without errors
- [ ] Backend starts without errors
- [ ] Database connection works
- [ ] All 16 pages load correctly
- [ ] Navigation between user types works
- [ ] API endpoints respond properly
- [ ] Test data created successfully
- [ ] PM2 processes running correctly

## 📞 Repository Support

If you encounter repository issues:

1. **Check the health check**: `./health-check.sh`
2. **View service logs**: `pm2 logs`
3. **Check file permissions**: `ls -la ~/wefuel-test/`
4. **Verify dependencies**: `npm ls`
5. **Test database**: `mongosh wefuel-test`

## 🚀 Next Steps

After successful repository setup:

1. **Start Testing**: Follow the `TESTING-GUIDE.md`
2. **Explore Features**: Test all 16 pages
3. **Run Performance Tests**: Use the provided testing tools
4. **Deploy to Production**: Use `deploy-linux.sh` when ready

---

**🎉 Your WeFuel repository is ready for testing!** 