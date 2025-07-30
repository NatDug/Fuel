import React, { useState } from "react";

interface Trip {
  id: string;
  orderId: string;
  customerName: string;
  fuelLitres: number;
  earnings: number;
  date: string;
  status: 'completed' | 'cancelled';
  rating?: number;
}

interface EarningsSummary {
  totalEarnings: number;
  totalTrips: number;
  averageRating: number;
  thisWeek: number;
  thisMonth: number;
  pendingPayout: number;
}

const mockTrips: Trip[] = [
  {
    id: '1',
    orderId: 'ORD-001',
    customerName: 'John Smith',
    fuelLitres: 15,
    earnings: 45.00,
    date: '2024-01-15',
    status: 'completed',
    rating: 5
  },
  {
    id: '2',
    orderId: 'ORD-002',
    customerName: 'Sarah Johnson',
    fuelLitres: 20,
    earnings: 60.00,
    date: '2024-01-14',
    status: 'completed',
    rating: 4
  },
  {
    id: '3',
    orderId: 'ORD-003',
    customerName: 'Mike Wilson',
    fuelLitres: 10,
    earnings: 30.00,
    date: '2024-01-13',
    status: 'completed',
    rating: 5
  },
  {
    id: '4',
    orderId: 'ORD-004',
    customerName: 'Lisa Brown',
    fuelLitres: 25,
    earnings: 75.00,
    date: '2024-01-12',
    status: 'cancelled',
    earnings: 0
  }
];

const mockSummary: EarningsSummary = {
  totalEarnings: 210.00,
  totalTrips: 4,
  averageRating: 4.7,
  thisWeek: 135.00,
  thisMonth: 210.00,
  pendingPayout: 45.00
};

const DriverEarningsPage: React.FC = () => {
  const [trips] = useState<Trip[]>(mockTrips);
  const [summary] = useState<EarningsSummary>(mockSummary);
  const [timeFilter, setTimeFilter] = useState<'all' | 'week' | 'month'>('all');

  const getStatusColor = (status: string) => {
    return status === 'completed' ? 'text-green-600' : 'text-red-600';
  };

  const getRatingStars = (rating?: number) => {
    if (!rating) return 'No rating';
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const filteredTrips = trips.filter(trip => {
    if (timeFilter === 'all') return true;
    const tripDate = new Date(trip.date);
    const now = new Date();
    
    if (timeFilter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return tripDate >= weekAgo;
    }
    
    if (timeFilter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return tripDate >= monthAgo;
    }
    
    return true;
  });

  const filteredEarnings = filteredTrips.reduce((sum, trip) => sum + trip.earnings, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Earnings Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Earnings</p>
                <p className="text-2xl font-bold">R{summary.totalEarnings.toFixed(2)}</p>
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
                <p className="text-sm text-gray-500">Total Trips</p>
                <p className="text-2xl font-bold">{summary.totalTrips}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Average Rating</p>
                <p className="text-2xl font-bold">{summary.averageRating}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Pending Payout</p>
                <p className="text-2xl font-bold">R{summary.pendingPayout.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Time Period Filter */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Trip History</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setTimeFilter('all')}
                className={`px-4 py-2 rounded ${timeFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                All Time
              </button>
              <button
                onClick={() => setTimeFilter('week')}
                className={`px-4 py-2 rounded ${timeFilter === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                This Week
              </button>
              <button
                onClick={() => setTimeFilter('month')}
                className={`px-4 py-2 rounded ${timeFilter === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                This Month
              </button>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Showing {filteredTrips.length} trips • Total: R{filteredEarnings.toFixed(2)}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Order ID</th>
                  <th className="text-left py-3 px-4">Customer</th>
                  <th className="text-left py-3 px-4">Fuel</th>
                  <th className="text-left py-3 px-4">Earnings</th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Rating</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrips.map((trip) => (
                  <tr key={trip.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{trip.orderId}</td>
                    <td className="py-3 px-4">{trip.customerName}</td>
                    <td className="py-3 px-4">{trip.fuelLitres}L</td>
                    <td className="py-3 px-4 font-medium">R{trip.earnings.toFixed(2)}</td>
                    <td className="py-3 px-4">{trip.date}</td>
                    <td className="py-3 px-4">
                      <span className={`font-medium ${getStatusColor(trip.status)}`}>
                        {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-yellow-500">
                      {getRatingStars(trip.rating)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payout Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Payout Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500">Available for Payout</p>
              <p className="text-2xl font-bold text-green-600">R{summary.pendingPayout.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Next Payout Date</p>
              <p className="text-lg font-medium">January 20, 2024</p>
            </div>
            <div>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                Request Payout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverEarningsPage; 