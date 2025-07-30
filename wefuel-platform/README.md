# WeFuel Platform

A comprehensive fuel delivery platform built with React, TypeScript, and Tailwind CSS. The platform serves multiple user types including customers, drivers, station owners, and administrators.

## 🚀 Features

### Core Platform Features
- **Multi-User System**: Support for customers, drivers, station owners, and administrators
- **Real-time Order Tracking**: Google Maps integration for live delivery tracking
- **Wallet System**: Digital wallet for customers with transaction history
- **Pricing Engine**: Dynamic pricing with VAT, surcharges, and regional adjustments
- **FICA Compliance**: Document verification system for regulatory compliance
- **Referral System**: Driver referral program with rewards
- **Review System**: Customer feedback and rating system

### User Types & Capabilities

#### 👤 Customer Portal
- **Fuel Ordering**: Place fuel orders with real-time pricing
- **Wallet Management**: View balance, transaction history, and withdrawals
- **Order Tracking**: Real-time delivery tracking with Google Maps
- **Account Management**: Profile management and FICA verification

#### 🚚 Driver Portal
- **Training System**: Interactive training modules with quiz system
- **Delivery Management**: Accept, manage, and complete deliveries
- **Earnings Tracking**: View earnings, trip history, and performance metrics
- **Referral Program**: Manage referrals and earn rewards

#### 🏪 Station Portal
- **Dashboard**: Real-time sales metrics and inventory overview
- **Inventory Management**: Track fuel levels, prices, and stock alerts
- **Order Processing**: Manage customer orders and delivery coordination
- **Reports & Analytics**: Sales reports, fuel consumption, and performance metrics

#### 👨‍💼 Admin Portal
- **Platform Dashboard**: System-wide metrics and activity monitoring
- **User Management**: Manage all users, approve registrations, and handle disputes
- **System Settings**: Configure pricing, fees, and platform parameters

## 📁 Project Structure

```
wefuel-platform/
├── src/
│   ├── components/
│   │   ├── AuthForm.tsx          # Login/Signup form component
│   │   ├── FuelOrderForm.tsx     # Fuel ordering form
│   │   ├── OrderSummary.tsx      # Order summary display
│   │   └── Navigation.tsx        # Main navigation component
│   ├── pages/
│   │   ├── DemoPage.tsx          # Platform demo and navigation hub
│   │   ├── LoginPage.tsx         # Authentication page
│   │   ├── FuelOrderPage.tsx     # Customer fuel ordering
│   │   ├── WalletPage.tsx        # Customer wallet management
│   │   ├── TrackOrderPage.tsx    # Order tracking with maps
│   │   ├── DriverTrainingPage.tsx    # Driver training modules
│   │   ├── DriverDeliveriesPage.tsx  # Driver delivery management
│   │   ├── DriverEarningsPage.tsx    # Driver earnings tracking
│   │   ├── DriverReferralsPage.tsx   # Driver referral management
│   │   ├── StationDashboardPage.tsx  # Station overview dashboard
│   │   ├── StationInventoryPage.tsx  # Station inventory management
│   │   ├── StationOrdersPage.tsx     # Station order processing
│   │   ├── StationReportsPage.tsx    # Station analytics and reports
│   │   ├── AdminDashboardPage.tsx    # Admin platform overview
│   │   ├── AdminUserManagementPage.tsx # Admin user management
│   │   └── AdminSystemSettingsPage.tsx # Admin system configuration
│   ├── App.tsx                   # Main application with routing
│   └── main.tsx                  # Application entry point
├── package.json                  # Dependencies and scripts
└── README.md                     # This file
```

## 🛠️ Technology Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **React Router DOM**: Client-side routing
- **@react-google-maps/api**: Google Maps integration

### Backend (wefuel-backend/)
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **CORS**: Cross-origin resource sharing
- **dotenv**: Environment variable management

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wefuel-platform
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../wefuel-backend
   npm install
   ```

4. **Set up environment variables**
   ```bash
   # In wefuel-backend/config.env
   MONGODB_URI=mongodb://localhost:27017/wefuel
   PORT=4000
   ```

5. **Start the development servers**
   ```bash
   # Start backend (from wefuel-backend directory)
   npm run dev
   
   # Start frontend (from wefuel-platform directory)
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4000

## 📱 Available Pages

### Customer Pages
- `/order` - Fuel ordering interface
- `/wallet` - Wallet management and transactions
- `/track` - Real-time order tracking

### Driver Pages
- `/driver/training` - Training modules and quiz system
- `/driver/deliveries` - Delivery management interface
- `/driver/earnings` - Earnings and trip history
- `/driver/referrals` - Referral program management

### Station Pages
- `/station/dashboard` - Station overview and metrics
- `/station/inventory` - Fuel inventory management
- `/station/orders` - Order processing interface
- `/station/reports` - Sales analytics and reports

### Admin Pages
- `/admin/dashboard` - Platform overview and monitoring
- `/admin/users` - User management and approvals
- `/admin/settings` - System configuration

### Demo & Navigation
- `/` - Platform demo with user type selection

## 🔧 Configuration

### Google Maps API
To enable order tracking functionality, you'll need a Google Maps API key:

1. Get an API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Maps JavaScript API
3. Replace the placeholder in `TrackOrderPage.tsx`

### Database Configuration
The platform uses MongoDB with the following collections:
- `users` - User accounts and profiles
- `orders` - Fuel orders and delivery information
- `transactions` - Wallet transactions and history

## 🧪 Testing

### Backend Testing
```bash
cd wefuel-backend
npm run test-signup-login    # Test signup/login flow
npm run test-api            # Test API endpoints
```

### Frontend Testing
```bash
cd wefuel-platform
npm run test
```

## 📊 Platform Statistics

- **4 User Types**: Customer, Driver, Station, Admin
- **15 Total Pages**: Comprehensive interface for all user types
- **100% Responsive**: Mobile-first design approach
- **TypeScript**: Full type safety throughout the application
- **Modern UI**: Clean, intuitive interface with Tailwind CSS

## 🔒 Security Features

- **Unique Constraints**: One email/phone per account
- **Card Limits**: Maximum 3 accounts per payment card
- **FICA Verification**: Regulatory compliance system
- **Session Management**: Secure authentication and authorization

## 🚀 Deployment

### Frontend Deployment
```bash
npm run build
# Deploy the dist/ folder to your hosting provider
```

### Backend Deployment
```bash
# Set production environment variables
npm start
# Deploy to your Node.js hosting provider
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**WeFuel Platform** - Revolutionizing fuel delivery with modern technology and user-centric design. 