# WeFuel Frontend Setup Guide

## Overview

The WeFuel platform frontend is a comprehensive React/TypeScript application that serves multiple user types: customers, drivers, station owners, and administrators. This guide covers both the full React build setup and a standalone HTML version.

## 🚀 Quick Start (Standalone HTML Version)

If you don't have Node.js installed or want to quickly preview the platform:

1. **Open the standalone version:**
   ```bash
   # Simply open this file in your browser
   wefuel-platform/index-standalone.html
   ```

2. **Features available:**
   - Interactive user type selection (Customer, Driver, Station, Admin)
   - Navigation between different portal pages
   - Responsive design with Tailwind CSS
   - Sample data and UI components

## 🛠️ Full React Development Setup

### Prerequisites

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager

### Installation

1. **Navigate to the frontend directory:**
   ```bash
   cd wefuel-platform
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - Navigate to: `http://localhost:5173`
   - The application will automatically reload when you make changes

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run test         # Run tests
```

## 📁 Project Structure

```
wefuel-platform/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── AuthForm.tsx     # Login/Signup form
│   │   ├── FuelOrderForm.tsx # Fuel ordering interface
│   │   ├── Navigation.tsx   # Main navigation
│   │   └── OrderSummary.tsx # Order summary display
│   ├── pages/               # Page components
│   │   ├── DemoPage.tsx     # Platform demo hub
│   │   ├── LoginPage.tsx    # Authentication
│   │   ├── FuelOrderPage.tsx # Customer fuel ordering
│   │   ├── WalletPage.tsx   # Customer wallet
│   │   ├── TrackOrderPage.tsx # Order tracking
│   │   ├── DriverTrainingPage.tsx # Driver training
│   │   ├── DriverDeliveriesPage.tsx # Driver deliveries
│   │   ├── DriverEarningsPage.tsx # Driver earnings
│   │   ├── DriverReferralsPage.tsx # Driver referrals
│   │   ├── StationDashboardPage.tsx # Station overview
│   │   ├── StationInventoryPage.tsx # Station inventory
│   │   ├── StationOrdersPage.tsx # Station orders
│   │   ├── StationReportsPage.tsx # Station reports
│   │   ├── AdminDashboardPage.tsx # Admin overview
│   │   ├── AdminUserManagementPage.tsx # User management
│   │   └── AdminSystemSettingsPage.tsx # System settings
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── index-standalone.html    # Standalone HTML version
└── FRONTEND-SETUP.md        # This file
```

## 🎨 Design System

### Colors

The platform uses a custom color palette:

- **Primary Blue**: `#2563eb` - Main brand color
- **Fuel Orange**: `#ed7518` - Fuel-related elements
- **Success Green**: `#10b981` - Positive actions
- **Warning Orange**: `#f59e0b` - Warnings
- **Error Red**: `#ef4444` - Errors

### Components

Common UI components are defined in `src/index.css`:

- `.btn-primary` - Primary action buttons
- `.btn-secondary` - Secondary action buttons
- `.card` - Content containers
- `.input-field` - Form inputs

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:4000
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Google Maps Integration

For order tracking functionality:

1. Get an API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Maps JavaScript API
3. Add the key to your environment variables

## 📱 User Portals

### Customer Portal
- **Fuel Ordering**: Place orders with real-time pricing
- **Wallet Management**: View balance and transaction history
- **Order Tracking**: Real-time delivery tracking with maps

### Driver Portal
- **Training System**: Interactive training modules
- **Delivery Management**: Accept and manage deliveries
- **Earnings Tracking**: View earnings and performance
- **Referral Program**: Manage referrals and rewards

### Station Portal
- **Dashboard**: Real-time sales and inventory metrics
- **Inventory Management**: Track fuel levels and prices
- **Order Processing**: Manage customer orders
- **Reports**: Sales analytics and performance metrics

### Admin Portal
- **Platform Dashboard**: System-wide metrics
- **User Management**: Manage all users and approvals
- **System Settings**: Configure platform parameters

## 🚀 Deployment

### Production Build

```bash
npm run build
```

This creates a `dist/` folder with optimized production files.

### Deployment Options

1. **Static Hosting** (Netlify, Vercel, GitHub Pages):
   - Upload the `dist/` folder
   - Configure routing for SPA

2. **Docker** (see `Dockerfile`):
   ```bash
   docker build -t wefuel-frontend .
   docker run -p 80:80 wefuel-frontend
   ```

3. **Nginx** (see `nginx.conf`):
   - Copy `dist/` contents to web server
   - Configure nginx for SPA routing

## 🔗 Backend Integration

The frontend is designed to work with the WeFuel backend API:

- **API Base URL**: `http://localhost:4000`
- **Authentication**: JWT-based
- **Real-time Updates**: WebSocket connections for live data

## 🧪 Testing

```bash
npm run test        # Run unit tests
npm run test:watch  # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

## 📊 Performance

- **Bundle Size**: Optimized with Vite
- **Loading Speed**: Lazy loading for routes
- **SEO**: Meta tags and structured data
- **Accessibility**: WCAG 2.1 compliant

## 🆘 Troubleshooting

### Common Issues

1. **Port already in use**:
   ```bash
   # Change port in vite.config.ts
   server: { port: 3000 }
   ```

2. **TypeScript errors**:
   ```bash
   npm run lint
   # Fix any type issues
   ```

3. **Build failures**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### Getting Help

- Check the browser console for errors
- Review the network tab for API issues
- Ensure all dependencies are installed
- Verify environment variables are set correctly

## 📄 License

This project is licensed under the MIT License.

---

**WeFuel Platform** - Revolutionizing fuel delivery with modern technology and user-centric design. 