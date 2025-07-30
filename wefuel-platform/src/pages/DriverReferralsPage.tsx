import React, { useState } from "react";

interface Referral {
  id: string;
  driverName: string;
  driverEmail: string;
  signupDate: string;
  status: 'pending' | 'active' | 'completed';
  tripsCompleted: number;
  milestone: 'none' | '50_trips' | '100_trips';
  rewardEarned: number;
}

interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  totalRewards: number;
  pendingRewards: number;
  nextMilestone: string;
}

const mockReferrals: Referral[] = [
  {
    id: '1',
    driverName: 'John Smith',
    driverEmail: 'john.smith@email.com',
    signupDate: '2024-01-10',
    status: 'active',
    tripsCompleted: 75,
    milestone: '50_trips',
    rewardEarned: 150.00
  },
  {
    id: '2',
    driverName: 'Sarah Johnson',
    driverEmail: 'sarah.j@email.com',
    signupDate: '2024-01-05',
    status: 'pending',
    tripsCompleted: 25,
    milestone: 'none',
    rewardEarned: 0
  },
  {
    id: '3',
    driverName: 'Mike Wilson',
    driverEmail: 'mike.w@email.com',
    signupDate: '2024-01-15',
    status: 'completed',
    tripsCompleted: 120,
    milestone: '100_trips',
    rewardEarned: 300.00
  }
];

const mockStats: ReferralStats = {
  totalReferrals: 3,
  activeReferrals: 2,
  totalRewards: 450.00,
  pendingRewards: 150.00,
  nextMilestone: '100 trips - R300 reward'
};

const DriverReferralsPage: React.FC = () => {
  const [referrals] = useState<Referral[]>(mockReferrals);
  const [stats] = useState<ReferralStats>(mockStats);
  const [showShareModal, setShowShareModal] = useState(false);
  const referralCode = "DRIVER123";

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMilestoneText = (milestone: string) => {
    switch (milestone) {
      case '50_trips': return '50 Trips - R150';
      case '100_trips': return '100 Trips - R300';
      default: return 'No milestone yet';
    }
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    alert('Referral code copied to clipboard!');
  };

  const shareReferralCode = () => {
    setShowShareModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Referral Program</h1>

        {/* Referral Code Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow p-8 mb-8 text-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Your Referral Code</h2>
            <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-6">
              <p className="text-3xl font-mono font-bold">{referralCode}</p>
            </div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={copyReferralCode}
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100"
              >
                Copy Code
              </button>
              <button
                onClick={shareReferralCode}
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100"
              >
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Referrals</p>
                <p className="text-2xl font-bold">{stats.totalReferrals}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Active Referrals</p>
                <p className="text-2xl font-bold">{stats.activeReferrals}</p>
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
                <p className="text-sm text-gray-500">Total Rewards</p>
                <p className="text-2xl font-bold">R{stats.totalRewards.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Pending Rewards</p>
                <p className="text-2xl font-bold">R{stats.pendingRewards.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Milestones Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Referral Milestones</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">50</div>
              <p className="text-sm text-gray-600 mb-2">Trips Completed</p>
              <p className="font-medium text-green-600">R150 Reward</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">100</div>
              <p className="text-sm text-gray-600 mb-2">Trips Completed</p>
              <p className="font-medium text-green-600">R300 Reward</p>
            </div>
            <div className="text-center p-4 border rounded-lg bg-gray-50">
              <div className="text-3xl font-bold text-gray-400 mb-2">200</div>
              <p className="text-sm text-gray-600 mb-2">Trips Completed</p>
              <p className="font-medium text-gray-500">Coming Soon</p>
            </div>
          </div>
        </div>

        {/* Referrals List */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">Your Referrals</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Driver</th>
                  <th className="text-left py-3 px-4">Signup Date</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Trips</th>
                  <th className="text-left py-3 px-4">Milestone</th>
                  <th className="text-left py-3 px-4">Reward Earned</th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((referral) => (
                  <tr key={referral.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{referral.driverName}</p>
                        <p className="text-sm text-gray-500">{referral.driverEmail}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">{referral.signupDate}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(referral.status)}`}>
                        {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium">{referral.tripsCompleted}</td>
                    <td className="py-3 px-4">
                      <span className="text-sm">
                        {getMilestoneText(referral.milestone)}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-green-600">
                      R{referral.rewardEarned.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Share Your Referral Code</h3>
              <p className="text-gray-600 mb-4">
                Share this code with potential drivers to earn rewards when they complete milestones.
              </p>
              <div className="bg-gray-100 p-3 rounded mb-4">
                <p className="font-mono text-center text-lg">{referralCode}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    copyReferralCode();
                    setShowShareModal(false);
                  }}
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Copy & Share
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverReferralsPage; 