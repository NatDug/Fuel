# WeFuel Platform - Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Environment Setup
- [ ] Node.js 16+ installed
- [ ] npm 8+ installed
- [ ] MongoDB installed and running
- [ ] Git repository cloned
- [ ] All dependencies installed

### 2. Backend Configuration
- [ ] `wefuel-backend/config.env` configured
- [ ] MongoDB connection string set
- [ ] Port configuration (default: 4000)
- [ ] CORS settings configured
- [ ] API endpoints tested

### 3. Frontend Configuration
- [ ] `wefuel-platform/env.example` copied to `.env`
- [ ] API URLs configured for environment
- [ ] Google Maps API key (if using maps)
- [ ] Build process working
- [ ] Static files generated

### 4. Database Setup
- [ ] MongoDB running
- [ ] Database created: `wefuel`
- [ ] Collections exist: `users`, `orders`, `transactions`
- [ ] Indexes created for performance
- [ ] Sample data loaded (optional)

### 5. API Integration
- [ ] Frontend can connect to backend
- [ ] Authentication endpoints working
- [ ] Order placement working
- [ ] Wallet operations working
- [ ] Health checks passing

## 🚀 Deployment Options

### Option 1: Local Development
```bash
# Terminal 1: Start Backend
cd wefuel-backend
npm install
npm start

# Terminal 2: Start Frontend
cd wefuel-platform
npm install
npm run dev
```

### Option 2: Production Build
```bash
# Build frontend
cd wefuel-platform
npm run build

# Start backend
cd wefuel-backend
npm start

# Serve frontend (using nginx or similar)
```

### Option 3: Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d
```

### Option 4: Standalone HTML (No Node.js Required)
```bash
# Simply open in browser
wefuel-platform/index-standalone.html
```

## 🔧 Configuration Files

### Backend Environment (`wefuel-backend/config.env`)
```env
MONGODB_URI=mongodb://localhost:27017/wefuel
PORT=4000
NODE_ENV=production
```

### Frontend Environment (`wefuel-platform/.env`)
```env
VITE_API_URL=http://localhost:4000
VITE_API_BASE_URL=http://localhost:4000/api
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
VITE_APP_NAME=WeFuel Platform
VITE_ENABLE_DEBUG_MODE=false
```

## 📋 API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/signup` - User registration

### Orders
- `POST /api/order` - Place fuel order
- `GET /api/track?orderId=xxx` - Track order

### Wallet
- `GET /api/wallet?userId=xxx` - Get wallet balance
- `POST /api/wallet/withdraw` - Withdraw funds

### Health
- `GET /api/health` - Health check
- `GET /` - API information

## 🧪 Testing

### Backend Tests
```bash
cd wefuel-backend
node test-api.js
node test-signup-login.js
```

### Frontend Tests
```bash
cd wefuel-platform
npm run test
```

### Manual Testing
1. **Authentication**
   - [ ] User registration
   - [ ] User login
   - [ ] Session management

2. **Fuel Orders**
   - [ ] Place fuel order
   - [ ] Order validation
   - [ ] Order tracking

3. **Wallet**
   - [ ] View balance
   - [ ] Transaction history
   - [ ] Withdraw funds

4. **User Portals**
   - [ ] Customer portal
   - [ ] Driver portal
   - [ ] Station portal
   - [ ] Admin portal

## 🔒 Security Checklist

- [ ] CORS properly configured
- [ ] Input validation implemented
- [ ] Error handling in place
- [ ] No sensitive data in logs
- [ ] Environment variables secured
- [ ] HTTPS enabled (production)

## 📊 Monitoring

### Health Checks
- [ ] Backend health endpoint responding
- [ ] Frontend loading correctly
- [ ] Database connection stable
- [ ] API response times acceptable

### Logs
- [ ] Backend logs accessible
- [ ] Frontend errors logged
- [ ] Database queries optimized
- [ ] Error tracking implemented

## 🚨 Troubleshooting

### Common Issues

1. **Backend won't start**
   - Check MongoDB connection
   - Verify port availability
   - Check environment variables

2. **Frontend build fails**
   - Verify Node.js version
   - Clear npm cache
   - Check for missing dependencies

3. **API calls failing**
   - Verify CORS settings
   - Check API URLs
   - Test network connectivity

4. **Database connection issues**
   - Verify MongoDB running
   - Check connection string
   - Test database permissions

### Debug Commands
```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check MongoDB status
mongosh --eval "db.runCommand('ping')"

# Test backend health
curl http://localhost:4000/api/health

# Test frontend
curl http://localhost:5173
```

## 📞 Support

### Files to Check
- `wefuel-backend/index.js` - Backend server
- `wefuel-backend/config.env` - Backend configuration
- `wefuel-platform/src/utils/api.ts` - API integration
- `wefuel-platform/env.example` - Frontend configuration
- `deployment-config.json` - Deployment settings
- `build-and-deploy.sh` - Deployment script

### Log Locations
- Backend: `wefuel-backend/logs/`
- Frontend: Browser console
- Database: MongoDB logs

## ✅ Final Verification

Before going live:
- [ ] All tests passing
- [ ] Performance acceptable
- [ ] Security measures in place
- [ ] Monitoring configured
- [ ] Backup strategy ready
- [ ] Documentation updated
- [ ] Team trained on deployment

---

**Status**: Ready for deployment ✅
**Last Updated**: $(date)
**Version**: 1.0.0 