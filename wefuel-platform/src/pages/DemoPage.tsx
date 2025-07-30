import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "../components/Navigation";

type UserType = 'customer' | 'driver' | 'station' | 'admin';

const DemoPage: React.FC = () => {
  const [selectedUserType, setSelectedUserType] = useState<UserType>('customer');

  const userTypes = [
    {
      type: 'customer' as UserType,
      name: 'Customer',
      description: 'Order fuel and track deliveries',
      icon: '⛽',
      color: 'blue',
      pages: [
        { name: 'Fuel Order', path: '/order', description: 'Place fuel orders' },
        { name: 'Wallet', path: '/wallet', description: 'Manage your wallet' },
        { name: 'Track Order', path: '/track', description: 'Track your deliveries' },
      ]
    },
    {
      type: 'driver' as UserType,
      name: 'Driver',
      description: 'Manage deliveries and earnings',
      icon: '🚚',
      color: 'green',
      pages: [
        { name: 'Training', path: '/driver/training', description: 'Complete training modules' },
        { name: 'Deliveries', path: '/driver/deliveries', description: 'Manage your deliveries' },
        { name: 'Earnings', path: '/driver/earnings', description: 'View earnings and trips' },
        { name: 'Referrals', path: '/driver/referrals', description: 'Manage your referrals' },
      ]
    },
    {
      type: 'station' as UserType,
      name: 'Station',
      description: 'Manage inventory and orders',
      icon: '🏪',
      color: 'purple',
      pages: [
        { name: 'Dashboard', path: '/station/dashboard', description: 'View station overview' },
        { name: 'Inventory', path: '/station/inventory', description: 'Manage fuel inventory' },
        { name: 'Orders', path: '/station/orders', description: 'Process customer orders' },
        { name: 'Reports', path: '/station/reports', description: 'View sales reports' },
      ]
    },
    {
      type: 'admin' as UserType,
      name: 'Admin',
      description: 'Platform management and settings',
      icon: '👨‍💼',
      color: 'red',
      pages: [
        { name: 'Dashboard', path: '/admin/dashboard', description: 'Platform overview' },
        { name: 'User Management', path: '/admin/users', description: 'Manage all users' },
        { name: 'System Settings', path: '/admin/settings', description: 'Configure platform' },
      ]
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'green':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'purple':
        return 'bg-purple-50 border-purple-200 text-purple-800';
      case 'red':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getButtonColor = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-600 hover:bg-blue-700';
      case 'green':
        return 'bg-green-600 hover:bg-green-700';
      case 'purple':
        return 'bg-purple-600 hover:bg-purple-700';
      case 'red':
        return 'bg-red-600 hover:bg-red-700';
      default:
        return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation userType={selectedUserType} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            WeFuel Platform Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore all sections of the WeFuel platform. Select a user type below to see the available features and navigate through the different interfaces.
          </p>
        </div>

        {/* User Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {userTypes.map((userType) => (
            <div
              key={userType.type}
              className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                selectedUserType === userType.type
                  ? getColorClasses(userType.color)
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedUserType(userType.type)}
            >
              <div className="text-center">
                <div className="text-4xl mb-4">{userType.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{userType.name}</h3>
                <p className="text-sm text-gray-600">{userType.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Selected User Type Pages */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center mb-6">
            <span className="text-3xl mr-4">
              {userTypes.find(ut => ut.type === selectedUserType)?.icon}
            </span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {userTypes.find(ut => ut.type === selectedUserType)?.name} Portal
              </h2>
              <p className="text-gray-600">
                {userTypes.find(ut => ut.type === selectedUserType)?.description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userTypes
              .find(ut => ut.type === selectedUserType)
              ?.pages.map((page) => (
                <Link
                  key={page.path}
                  to={page.path}
                  className={`block p-6 border rounded-lg hover:shadow-md transition-all ${
                    getColorClasses(userTypes.find(ut => ut.type === selectedUserType)?.color || 'gray')
                  }`}
                >
                  <h3 className="text-lg font-semibold mb-2">{page.name}</h3>
                  <p className="text-sm mb-4">{page.description}</p>
                  <button
                    className={`text-white px-4 py-2 rounded-lg text-sm font-medium ${getButtonColor(
                      userTypes.find(ut => ut.type === selectedUserType)?.color || 'gray'
                    )}`}
                  >
                    View Page
                  </button>
                </Link>
              ))}
          </div>
        </div>

        {/* Platform Overview */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Platform Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">4</div>
              <div className="text-sm text-gray-600">User Types</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">15</div>
              <div className="text-sm text-gray-600">Total Pages</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
              <div className="text-sm text-gray-600">Responsive Design</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">React</div>
              <div className="text-sm text-gray-600">Built with React + TypeScript</div>
            </div>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            You can also navigate directly to any page using the URL:
          </p>
          <div className="bg-gray-100 rounded-lg p-4 text-sm font-mono text-gray-800">
            /login | /order | /wallet | /track | /driver/* | /station/* | /admin/*
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoPage; 