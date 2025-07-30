import React, { useState } from "react";

interface PlatformStats {
  totalUsers: number;
  totalDrivers: number;
  totalStations: number;
  totalOrders: number;
  totalRevenue: number;
  activeOrders: number;
  pendingApprovals: number;
  systemHealth: string;
}

interface RecentActivity {
  id: number;
  type: string;
  description: string;
  timestamp: string;
  status: string;
}

const mockStats: PlatformStats = {
  totalUsers: 1247,
  totalDrivers: 89,
  totalStations: 23,
  totalOrders: 5678,
  totalRevenue: 2345678.90,
  activeOrders: 45,
  pendingApprovals: 12,
  systemHealth: "Healthy"
};

const mockRecentActivity: RecentActivity[] = [
  {
    id: 1,
    type: "New Driver",
    description: "John Doe completed training and background check",
    timestamp: "2 minutes ago",
    status: "Pending Approval"
  },
  {
    id: 2,
    type: "New Station",
    description: "Fuel Express Station #15 registered",
    timestamp: "15 minutes ago",
    status: "Approved"
  },
  {
    id: 3,
    type: "Payment Issue",
    description: "Transaction failed for Order #12345",
    timestamp: "1 hour ago",
    status: "Resolved"
  },
  {
    id: 4,
    type: "System Alert",
    description: "High server load detected",
    timestamp: "2 hours ago",
    status: "Monitoring"
  },
  {
    id: 5,
    type: "User Report",
    description: "Customer complaint about delivery delay",
    timestamp: "3 hours ago",
    status: "Under Review"
  }
];

const AdminDashboardPage: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("today");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'resolved':
        return 'text-green-600 bg-green-100';
      case 'pending approval':
      case 'under review':
        return 'text-yellow-600 bg-yellow-100';
      case 'monitoring':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Platform overview and system monitoring</p>
        </div>

        {/* Time Filter */}
        <div className="mb-6">
          <div className="flex space-x-2">
            {['today', 'week', 'month', 'quarter'].map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => setSelectedTimeframe(timeframe)}
                className={`px-4 py-2 rounded-lg font-medium capitalize ${
                  selectedTimeframe === timeframe
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {timeframe}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.totalUsers.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Drivers</p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.totalDrivers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Stations</p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.totalStations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(mockStats.totalRevenue)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* System Status and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* System Health */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">System Health</h3>
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                mockStats.systemHealth === 'Healthy' ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className="font-medium">{mockStats.systemHealth}</span>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Active Orders:</span>
                <span className="font-medium">{mockStats.activeOrders}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Pending Approvals:</span>
                <span className="font-medium text-yellow-600">{mockStats.pendingApprovals}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-sm font-medium">
                Review Pending Approvals
              </button>
              <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 text-sm font-medium">
                Generate Reports
              </button>
              <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 text-sm font-medium">
                System Settings
              </button>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Total Orders:</span>
                <span className="font-medium">{mockStats.totalOrders.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Today's Orders:</span>
                <span className="font-medium">156</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Avg Order Value:</span>
                <span className="font-medium">{formatCurrency(413.50)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {mockRecentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{activity.type}</p>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      <p className="text-xs text-gray-500">{activity.timestamp}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                View All Activity
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage; 