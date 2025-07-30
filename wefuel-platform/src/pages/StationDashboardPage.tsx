import React, { useState } from "react";

interface FuelInventory {
  type: string;
  currentLevel: number;
  capacity: number;
  price: number;
  status: 'available' | 'low' | 'out';
}

interface SalesMetrics {
  todaySales: number;
  weekSales: number;
  monthSales: number;
  totalOrders: number;
  averageOrderValue: number;
}

interface RecentOrder {
  id: string;
  customerName: string;
  fuelType: string;
  litres: number;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  time: string;
}

const mockFuelInventory: FuelInventory[] = [
  {
    type: 'Petrol 95',
    currentLevel: 2500,
    capacity: 5000,
    price: 23.50,
    status: 'available'
  },
  {
    type: 'Petrol 93',
    currentLevel: 1800,
    capacity: 5000,
    price: 22.80,
    status: 'available'
  },
  {
    type: 'Diesel 50ppm',
    currentLevel: 800,
    capacity: 5000,
    price: 21.20,
    status: 'low'
  },
  {
    type: 'Diesel 500ppm',
    currentLevel: 0,
    capacity: 5000,
    price: 20.50,
    status: 'out'
  }
];

const mockSalesMetrics: SalesMetrics = {
  todaySales: 12500.00,
  weekSales: 85000.00,
  monthSales: 320000.00,
  totalOrders: 45,
  averageOrderValue: 277.78
};

const mockRecentOrders: RecentOrder[] = [
  {
    id: 'ORD-001',
    customerName: 'John Smith',
    fuelType: 'Petrol 95',
    litres: 15,
    total: 352.50,
    status: 'completed',
    time: '10:30 AM'
  },
  {
    id: 'ORD-002',
    customerName: 'Sarah Johnson',
    fuelType: 'Diesel 50ppm',
    litres: 20,
    total: 424.00,
    status: 'processing',
    time: '11:15 AM'
  },
  {
    id: 'ORD-003',
    customerName: 'Mike Wilson',
    fuelType: 'Petrol 93',
    litres: 10,
    total: 228.00,
    status: 'pending',
    time: '11:45 AM'
  }
];

const StationDashboardPage: React.FC = () => {
  const [inventory] = useState<FuelInventory[]>(mockFuelInventory);
  const [metrics] = useState<SalesMetrics>(mockSalesMetrics);
  const [recentOrders] = useState<RecentOrder[]>(mockRecentOrders);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-600';
      case 'low': return 'text-yellow-600';
      case 'out': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInventoryPercentage = (current: number, capacity: number) => {
    return (current / capacity) * 100;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Station Dashboard</h1>

        {/* Sales Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Today's Sales</p>
                <p className="text-2xl font-bold">R{metrics.todaySales.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Week Sales</p>
                <p className="text-2xl font-bold">R{metrics.weekSales.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Month Sales</p>
                <p className="text-2xl font-bold">R{metrics.monthSales.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold">{metrics.totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Avg Order</p>
                <p className="text-2xl font-bold">R{metrics.averageOrderValue.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Fuel Inventory */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">Fuel Inventory</h2>
            <div className="space-y-4">
              {inventory.map((fuel) => (
                <div key={fuel.type} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">{fuel.type}</h3>
                    <span className={`font-medium ${getStatusColor(fuel.status)}`}>
                      {fuel.status.charAt(0).toUpperCase() + fuel.status.slice(1)}
                    </span>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>{fuel.currentLevel}L / {fuel.capacity}L</span>
                      <span>R{fuel.price}/L</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          fuel.status === 'available' ? 'bg-green-500' :
                          fuel.status === 'low' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${getInventoryPercentage(fuel.currentLevel, fuel.capacity)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      {getInventoryPercentage(fuel.currentLevel, fuel.capacity).toFixed(1)}% full
                    </span>
                    <span className="font-medium">
                      R{(fuel.currentLevel * fuel.price).toFixed(2)} value
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">Recent Orders</h2>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{order.id}</h3>
                      <p className="text-sm text-gray-600">{order.customerName}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Fuel Type</p>
                      <p className="font-medium">{order.fuelType}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Litres</p>
                      <p className="font-medium">{order.litres}L</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Total</p>
                      <p className="font-medium">R{order.total.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {order.time}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                View All Orders
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors">
              <div className="text-center">
                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <p className="font-medium">New Order</p>
              </div>
            </button>
            <button className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors">
              <div className="text-center">
                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p className="font-medium">Inventory</p>
              </div>
            </button>
            <button className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition-colors">
              <div className="text-center">
                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="font-medium">Reports</p>
              </div>
            </button>
            <button className="bg-orange-600 text-white p-4 rounded-lg hover:bg-orange-700 transition-colors">
              <div className="text-center">
                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="font-medium">Settings</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StationDashboardPage; 