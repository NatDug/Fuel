import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface NavigationProps {
  userType?: 'customer' | 'driver' | 'station' | 'admin';
}

const Navigation: React.FC<NavigationProps> = ({ userType = 'customer' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const customerNavItems = [
    { name: "Fuel Order", path: "/order", icon: "⛽" },
    { name: "Wallet", path: "/wallet", icon: "💰" },
    { name: "Track Order", path: "/track", icon: "📍" },
  ];

  const driverNavItems = [
    { name: "Training", path: "/driver/training", icon: "📚" },
    { name: "Deliveries", path: "/driver/deliveries", icon: "🚚" },
    { name: "Earnings", path: "/driver/earnings", icon: "💵" },
    { name: "Referrals", path: "/driver/referrals", icon: "👥" },
  ];

  const stationNavItems = [
    { name: "Dashboard", path: "/station/dashboard", icon: "📊" },
    { name: "Inventory", path: "/station/inventory", icon: "📦" },
    { name: "Orders", path: "/station/orders", icon: "📋" },
    { name: "Reports", path: "/station/reports", icon: "📈" },
  ];

  const adminNavItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: "🏠" },
    { name: "User Management", path: "/admin/users", icon: "👥" },
    { name: "System Settings", path: "/admin/settings", icon: "⚙️" },
  ];

  const getNavItems = () => {
    switch (userType) {
      case 'driver':
        return driverNavItems;
      case 'station':
        return stationNavItems;
      case 'admin':
        return adminNavItems;
      default:
        return customerNavItems;
    }
  };

  const getUserTypeLabel = () => {
    switch (userType) {
      case 'driver':
        return 'Driver Portal';
      case 'station':
        return 'Station Portal';
      case 'admin':
        return 'Admin Portal';
      default:
        return 'WeFuel';
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-blue-600">WeFuel</span>
              <span className="ml-2 text-sm text-gray-500">({getUserTypeLabel()})</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {getNavItems().map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-blue-600">
                  {userType.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm text-gray-700 capitalize">{userType}</span>
            </div>
            <Link
              to="/login"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              Logout
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            {getNavItems().map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </Link>
            ))}
            <div className="border-t pt-4 mt-4">
              <div className="flex items-center space-x-2 px-3 py-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">
                    {userType.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-gray-700 capitalize">{userType}</span>
              </div>
              <Link
                to="/login"
                className="block px-3 py-2 text-gray-600 hover:text-gray-900 text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Logout
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation; 