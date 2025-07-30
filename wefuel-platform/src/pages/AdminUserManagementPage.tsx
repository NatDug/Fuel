import React, { useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'customer' | 'driver' | 'station';
  status: 'active' | 'pending' | 'suspended' | 'approved';
  joinedDate: string;
  lastActive: string;
  totalOrders?: number;
  totalEarnings?: number;
  rating?: number;
  location?: string;
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+27 82 123 4567",
    type: "customer",
    status: "active",
    joinedDate: "2024-01-15",
    lastActive: "2024-01-20",
    totalOrders: 12
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "+27 83 234 5678",
    type: "driver",
    status: "pending",
    joinedDate: "2024-01-18",
    lastActive: "2024-01-19",
    totalEarnings: 0,
    rating: 0
  },
  {
    id: "3",
    name: "Mike Wilson",
    email: "mike.w@email.com",
    phone: "+27 84 345 6789",
    type: "driver",
    status: "approved",
    joinedDate: "2024-01-10",
    lastActive: "2024-01-20",
    totalEarnings: 4500,
    rating: 4.8
  },
  {
    id: "4",
    name: "Fuel Express Station",
    email: "manager@fuelexpress.co.za",
    phone: "+27 11 456 7890",
    type: "station",
    status: "active",
    joinedDate: "2024-01-05",
    lastActive: "2024-01-20",
    location: "Sandton, Johannesburg"
  },
  {
    id: "5",
    name: "Lisa Brown",
    email: "lisa.b@email.com",
    phone: "+27 85 567 8901",
    type: "customer",
    status: "suspended",
    joinedDate: "2024-01-12",
    lastActive: "2024-01-15",
    totalOrders: 3
  },
  {
    id: "6",
    name: "David Smith",
    email: "david.s@email.com",
    phone: "+27 86 678 9012",
    type: "driver",
    status: "pending",
    joinedDate: "2024-01-19",
    lastActive: "2024-01-19",
    totalEarnings: 0,
    rating: 0
  }
];

const AdminUserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);

  const filteredUsers = users.filter(user => {
    const matchesType = selectedType === "all" || user.type === selectedType;
    const matchesStatus = selectedStatus === "all" || user.status === selectedStatus;
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone.includes(searchTerm);
    
    return matchesType && matchesStatus && matchesSearch;
  });

  const handleStatusChange = (userId: string, newStatus: User['status']) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
  };

  const handleBulkAction = (action: string) => {
    const selectedUsers = filteredUsers.filter(user => user.status === 'pending');
    
    if (action === 'approve') {
      setUsers(prev => prev.map(user => 
        selectedUsers.some(selected => selected.id === user.id) 
          ? { ...user, status: 'approved' as User['status'] } 
          : user
      ));
    } else if (action === 'suspend') {
      setUsers(prev => prev.map(user => 
        selectedUsers.some(selected => selected.id === user.id) 
          ? { ...user, status: 'suspended' as User['status'] } 
          : user
      ));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'suspended':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'customer':
        return 'text-blue-600 bg-blue-100';
      case 'driver':
        return 'text-green-600 bg-green-100';
      case 'station':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">Manage users, drivers, and stations</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">User Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="customer">Customers</option>
                <option value="driver">Drivers</option>
                <option value="station">Stations</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div className="flex items-end">
              <div className="flex space-x-2">
                <button
                  onClick={() => handleBulkAction('approve')}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-medium"
                >
                  Approve All Pending
                </button>
                <button
                  onClick={() => handleBulkAction('suspend')}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm font-medium"
                >
                  Suspend All Pending
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold">
              Users ({filteredUsers.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Active
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stats
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          <div className="text-sm text-gray-500">{user.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(user.type)}`}>
                        {user.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.joinedDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.lastActive).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.type === 'customer' && user.totalOrders && (
                        <div>Orders: {user.totalOrders}</div>
                      )}
                      {user.type === 'driver' && (
                        <div>
                          <div>Earnings: R{user.totalEarnings?.toLocaleString()}</div>
                          {user.rating && <div>Rating: {user.rating}/5</div>}
                        </div>
                      )}
                      {user.type === 'station' && user.location && (
                        <div>{user.location}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </button>
                        {user.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(user.id, 'approved')}
                              className="text-green-600 hover:text-green-900"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusChange(user.id, 'suspended')}
                              className="text-red-600 hover:text-red-900"
                            >
                              Suspend
                            </button>
                          </>
                        )}
                        {user.status === 'active' && (
                          <button
                            onClick={() => handleStatusChange(user.id, 'suspended')}
                            className="text-red-600 hover:text-red-900"
                          >
                            Suspend
                          </button>
                        )}
                        {user.status === 'suspended' && (
                          <button
                            onClick={() => handleStatusChange(user.id, 'active')}
                            className="text-green-600 hover:text-green-900"
                          >
                            Activate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Detail Modal */}
        {showModal && selectedUser && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">User Details</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="text-sm text-gray-900">{selectedUser.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-sm text-gray-900">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-sm text-gray-900">{selectedUser.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(selectedUser.type)}`}>
                      {selectedUser.type}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedUser.status)}`}>
                      {selectedUser.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Joined Date</label>
                    <p className="text-sm text-gray-900">{new Date(selectedUser.joinedDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Active</label>
                    <p className="text-sm text-gray-900">{new Date(selectedUser.lastActive).toLocaleDateString()}</p>
                  </div>
                  {selectedUser.location && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Location</label>
                      <p className="text-sm text-gray-900">{selectedUser.location}</p>
                    </div>
                  )}
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUserManagementPage; 