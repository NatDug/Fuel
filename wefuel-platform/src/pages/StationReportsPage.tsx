import React, { useState } from "react";

interface SalesData {
  date: string;
  revenue: number;
  orders: number;
  fuelSold: number;
}

interface FuelConsumption {
  fuelType: string;
  sold: number;
  remaining: number;
  revenue: number;
  percentage: number;
}

interface PerformanceMetrics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  fuelEfficiency: number;
  customerSatisfaction: number;
}

const mockSalesData: SalesData[] = [
  { date: '2024-01-10', revenue: 8500.00, orders: 25, fuelSold: 320 },
  { date: '2024-01-11', revenue: 9200.00, orders: 28, fuelSold: 350 },
  { date: '2024-01-12', revenue: 7800.00, orders: 22, fuelSold: 290 },
  { date: '2024-01-13', revenue: 10500.00, orders: 32, fuelSold: 410 },
  { date: '2024-01-14', revenue: 9800.00, orders: 30, fuelSold: 380 },
  { date: '2024-01-15', revenue: 12500.00, orders: 45, fuelSold: 520 }
];

const mockFuelConsumption: FuelConsumption[] = [
  { fuelType: 'Petrol 95', sold: 1250, remaining: 1250, revenue: 29375.00, percentage: 35 },
  { fuelType: 'Petrol 93', sold: 980, remaining: 1820, revenue: 22344.00, percentage: 28 },
  { fuelType: 'Diesel 50ppm', sold: 820, remaining: 800, revenue: 17384.00, percentage: 25 },
  { fuelType: 'Diesel 500ppm', sold: 0, remaining: 0, revenue: 0, percentage: 0 }
];

const mockPerformanceMetrics: PerformanceMetrics = {
  totalRevenue: 68300.00,
  totalOrders: 182,
  averageOrderValue: 375.27,
  fuelEfficiency: 94.5,
  customerSatisfaction: 4.7
};

const StationReportsPage: React.FC = () => {
  const [salesData] = useState<SalesData[]>(mockSalesData);
  const [fuelConsumption] = useState<FuelConsumption[]>(mockFuelConsumption);
  const [metrics] = useState<PerformanceMetrics>(mockPerformanceMetrics);
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'quarter'>('week');

  const getTotalRevenue = () => {
    return salesData.reduce((sum, day) => sum + day.revenue, 0);
  };

  const getTotalOrders = () => {
    return salesData.reduce((sum, day) => sum + day.orders, 0);
  };

  const getTotalFuelSold = () => {
    return salesData.reduce((sum, day) => sum + day.fuelSold, 0);
  };

  const getAverageOrderValue = () => {
    return getTotalRevenue() / getTotalOrders();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Station Reports & Analytics</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setTimeFilter('week')}
              className={`px-4 py-2 rounded ${timeFilter === 'week' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
            >
              This Week
            </button>
            <button
              onClick={() => setTimeFilter('month')}
              className={`px-4 py-2 rounded ${timeFilter === 'month' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
            >
              This Month
            </button>
            <button
              onClick={() => setTimeFilter('quarter')}
              className={`px-4 py-2 rounded ${timeFilter === 'quarter' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
            >
              This Quarter
            </button>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold">R{metrics.totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Avg Order Value</p>
                <p className="text-2xl font-bold">R{metrics.averageOrderValue.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Customer Rating</p>
                <p className="text-2xl font-bold">{metrics.customerSatisfaction}/5</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sales Trend */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">Sales Trend</h2>
            <div className="space-y-4">
              {salesData.map((day, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{day.date}</p>
                    <p className="text-sm text-gray-500">{day.orders} orders</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">R{day.revenue.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">{day.fuelSold}L sold</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total</span>
                <div className="text-right">
                  <p className="font-bold">R{getTotalRevenue().toFixed(2)}</p>
                  <p className="text-sm text-gray-500">{getTotalOrders()} orders • {getTotalFuelSold()}L</p>
                </div>
              </div>
            </div>
          </div>

          {/* Fuel Consumption */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">Fuel Consumption</h2>
            <div className="space-y-4">
              {fuelConsumption.map((fuel, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">{fuel.fuelType}</h3>
                    <span className="text-sm text-gray-500">{fuel.percentage}%</span>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Sold: {fuel.sold}L</span>
                      <span>Remaining: {fuel.remaining}L</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${fuel.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Revenue</span>
                    <span className="font-medium">R{fuel.revenue.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Indicators */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">Performance Indicators</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 border rounded-lg">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {metrics.fuelEfficiency}%
              </div>
              <p className="text-lg font-medium mb-2">Fuel Efficiency</p>
              <p className="text-sm text-gray-600">
                Optimal fuel utilization and minimal waste
              </p>
            </div>

            <div className="text-center p-6 border rounded-lg">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {getAverageOrderValue().toFixed(0)}
              </div>
              <p className="text-lg font-medium mb-2">Avg Order Value</p>
              <p className="text-sm text-gray-600">
                Average revenue per customer order
              </p>
            </div>

            <div className="text-center p-6 border rounded-lg">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {metrics.customerSatisfaction}
              </div>
              <p className="text-lg font-medium mb-2">Customer Rating</p>
              <p className="text-sm text-gray-600">
                Average customer satisfaction score
              </p>
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Export Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors">
              <div className="text-center">
                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="font-medium">Export PDF</p>
              </div>
            </button>
            <button className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors">
              <div className="text-center">
                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="font-medium">Export Excel</p>
              </div>
            </button>
            <button className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition-colors">
              <div className="text-center">
                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                <p className="font-medium">Share Report</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StationReportsPage; 