import React, { useState } from "react";

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  address: string;
  fuelType: string;
  litres: number;
  storeItems: string[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'completed' | 'cancelled';
  createdAt: string;
  estimatedDelivery: string;
  driverName?: string;
  driverPhone?: string;
  notes?: string;
}

const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    customerName: 'John Smith',
    customerPhone: '+27 82 123 4567',
    address: '123 Main St, Johannesburg',
    fuelType: 'Petrol 95',
    litres: 15,
    storeItems: ['Snack Pack', 'Cold Drink'],
    total: 425.50,
    status: 'pending',
    createdAt: '2024-01-15 10:30',
    estimatedDelivery: '2024-01-15 12:00'
  },
  {
    id: 'ORD-002',
    customerName: 'Sarah Johnson',
    customerPhone: '+27 83 234 5678',
    address: '456 Oak Ave, Pretoria',
    fuelType: 'Diesel 50ppm',
    litres: 20,
    storeItems: ['Car Wash'],
    total: 550.00,
    status: 'confirmed',
    createdAt: '2024-01-15 09:15',
    estimatedDelivery: '2024-01-15 11:30',
    driverName: 'Mike Wilson',
    driverPhone: '+27 84 345 6789'
  },
  {
    id: 'ORD-003',
    customerName: 'Lisa Brown',
    customerPhone: '+27 85 456 7890',
    address: '789 Pine Rd, Cape Town',
    fuelType: 'Petrol 93',
    litres: 10,
    storeItems: [],
    total: 275.00,
    status: 'preparing',
    createdAt: '2024-01-15 08:45',
    estimatedDelivery: '2024-01-15 10:15',
    driverName: 'David Lee',
    driverPhone: '+27 86 567 8901'
  },
  {
    id: 'ORD-004',
    customerName: 'Tom Wilson',
    customerPhone: '+27 87 678 9012',
    address: '321 Elm St, Durban',
    fuelType: 'Petrol 95',
    litres: 25,
    storeItems: ['Car Wash', 'Snack Pack'],
    total: 625.00,
    status: 'ready',
    createdAt: '2024-01-15 08:00',
    estimatedDelivery: '2024-01-15 09:30',
    driverName: 'Alex Chen',
    driverPhone: '+27 88 789 0123'
  }
];

const StationOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [filter, setFilter] = useState<'all' | 'pending' | 'active' | 'completed'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-purple-100 text-purple-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'delivering': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusActions = (order: Order) => {
    switch (order.status) {
      case 'pending':
        return (
          <div className="space-x-2">
            <button
              onClick={() => updateOrderStatus(order.id, 'confirmed')}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
            >
              Confirm
            </button>
            <button
              onClick={() => updateOrderStatus(order.id, 'cancelled')}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
            >
              Cancel
            </button>
          </div>
        );
      case 'confirmed':
        return (
          <button
            onClick={() => updateOrderStatus(order.id, 'preparing')}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
          >
            Start Preparing
          </button>
        );
      case 'preparing':
        return (
          <button
            onClick={() => updateOrderStatus(order.id, 'ready')}
            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
          >
            Mark Ready
          </button>
        );
      case 'ready':
        return (
          <button
            onClick={() => updateOrderStatus(order.id, 'delivering')}
            className="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700"
          >
            Start Delivery
          </button>
        );
      default:
        return null;
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    if (filter === 'pending') return order.status === 'pending';
    if (filter === 'active') return ['confirmed', 'preparing', 'ready', 'delivering'].includes(order.status);
    if (filter === 'completed') return ['completed', 'cancelled'].includes(order.status);
    return true;
  });

  const openDetailsModal = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Order Management</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
            >
              All Orders
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded ${filter === 'pending' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded ${filter === 'active' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded ${filter === 'completed' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Order Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold">{orders.filter(o => o.status === 'pending').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Active</p>
                <p className="text-2xl font-bold">{orders.filter(o => ['confirmed', 'preparing', 'ready', 'delivering'].includes(o.status)).length}</p>
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
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-bold">{orders.filter(o => o.status === 'completed').length}</p>
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
                <p className="text-sm text-gray-500">Today's Revenue</p>
                <p className="text-2xl font-bold">R{orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.total, 0).toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Orders ({filteredOrders.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-6">Order ID</th>
                  <th className="text-left py-3 px-6">Customer</th>
                  <th className="text-left py-3 px-6">Fuel</th>
                  <th className="text-left py-3 px-6">Total</th>
                  <th className="text-left py-3 px-6">Status</th>
                  <th className="text-left py-3 px-6">Created</th>
                  <th className="text-left py-3 px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-6 font-medium">{order.id}</td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-sm text-gray-500">{order.customerPhone}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium">{order.fuelType}</p>
                        <p className="text-sm text-gray-500">{order.litres}L</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium">R{order.total.toFixed(2)}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">{order.createdAt}</td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openDetailsModal(order)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View Details
                        </button>
                        {getStatusActions(order)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Details Modal */}
        {showDetailsModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Order Details - {selectedOrder.id}</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Customer Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Name:</span> {selectedOrder.customerName}</p>
                    <p><span className="font-medium">Phone:</span> {selectedOrder.customerPhone}</p>
                    <p><span className="font-medium">Address:</span> {selectedOrder.address}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Order Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Fuel Type:</span> {selectedOrder.fuelType}</p>
                    <p><span className="font-medium">Litres:</span> {selectedOrder.litres}L</p>
                    <p><span className="font-medium">Total:</span> R{selectedOrder.total.toFixed(2)}</p>
                    <p><span className="font-medium">Status:</span> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                      </span>
                    </p>
                  </div>
                </div>

                {selectedOrder.storeItems.length > 0 && (
                  <div className="md:col-span-2">
                    <h4 className="font-medium mb-2">Store Items</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedOrder.storeItems.map((item, index) => (
                        <span key={index} className="bg-gray-100 px-2 py-1 rounded text-sm">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedOrder.driverName && (
                  <div className="md:col-span-2">
                    <h4 className="font-medium mb-2">Driver Information</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Driver:</span> {selectedOrder.driverName}</p>
                      <p><span className="font-medium">Phone:</span> {selectedOrder.driverPhone}</p>
                    </div>
                  </div>
                )}

                <div className="md:col-span-2">
                  <h4 className="font-medium mb-2">Timeline</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Created:</span> {selectedOrder.createdAt}</p>
                    <p><span className="font-medium">Estimated Delivery:</span> {selectedOrder.estimatedDelivery}</p>
                  </div>
                </div>

                {selectedOrder.notes && (
                  <div className="md:col-span-2">
                    <h4 className="font-medium mb-2">Notes</h4>
                    <p className="text-sm text-gray-600">{selectedOrder.notes}</p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                >
                  Close
                </button>
                {getStatusActions(selectedOrder)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StationOrdersPage; 