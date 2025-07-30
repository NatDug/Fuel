import React, { useState } from "react";

interface Delivery {
  id: string;
  orderId: string;
  customerName: string;
  address: string;
  fuelLitres: number;
  storeItems: string[];
  total: number;
  status: 'pending' | 'accepted' | 'picked-up' | 'delivering' | 'completed' | 'cancelled';
  createdAt: string;
  estimatedDelivery: string;
}

const mockDeliveries: Delivery[] = [
  {
    id: '1',
    orderId: 'ORD-001',
    customerName: 'John Smith',
    address: '123 Main St, Johannesburg',
    fuelLitres: 15,
    storeItems: ['Snack Pack', 'Cold Drink'],
    total: 425.50,
    status: 'pending',
    createdAt: '2024-01-15 10:30',
    estimatedDelivery: '2024-01-15 12:00'
  },
  {
    id: '2',
    orderId: 'ORD-002',
    customerName: 'Sarah Johnson',
    address: '456 Oak Ave, Pretoria',
    fuelLitres: 20,
    storeItems: ['Car Wash'],
    total: 550.00,
    status: 'accepted',
    createdAt: '2024-01-15 09:15',
    estimatedDelivery: '2024-01-15 11:30'
  },
  {
    id: '3',
    orderId: 'ORD-003',
    customerName: 'Mike Wilson',
    address: '789 Pine Rd, Cape Town',
    fuelLitres: 10,
    storeItems: [],
    total: 275.00,
    status: 'delivering',
    createdAt: '2024-01-15 08:45',
    estimatedDelivery: '2024-01-15 10:15'
  }
];

const DriverDeliveriesPage: React.FC = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>(mockDeliveries);
  const [filter, setFilter] = useState<'all' | 'pending' | 'active' | 'completed'>('all');

  const updateDeliveryStatus = (deliveryId: string, newStatus: Delivery['status']) => {
    setDeliveries(prev => prev.map(delivery => 
      delivery.id === deliveryId ? { ...delivery, status: newStatus } : delivery
    ));
  };

  const getStatusColor = (status: Delivery['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'picked-up': return 'bg-purple-100 text-purple-800';
      case 'delivering': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusActions = (delivery: Delivery) => {
    switch (delivery.status) {
      case 'pending':
        return (
          <div className="space-x-2">
            <button
              onClick={() => updateDeliveryStatus(delivery.id, 'accepted')}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
            >
              Accept
            </button>
            <button
              onClick={() => updateDeliveryStatus(delivery.id, 'cancelled')}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
            >
              Decline
            </button>
          </div>
        );
      case 'accepted':
        return (
          <button
            onClick={() => updateDeliveryStatus(delivery.id, 'picked-up')}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
          >
            Mark Picked Up
          </button>
        );
      case 'picked-up':
        return (
          <button
            onClick={() => updateDeliveryStatus(delivery.id, 'delivering')}
            className="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700"
          >
            Start Delivery
          </button>
        );
      case 'delivering':
        return (
          <button
            onClick={() => updateDeliveryStatus(delivery.id, 'completed')}
            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
          >
            Mark Delivered
          </button>
        );
      default:
        return null;
    }
  };

  const filteredDeliveries = deliveries.filter(delivery => {
    if (filter === 'all') return true;
    if (filter === 'pending') return delivery.status === 'pending';
    if (filter === 'active') return ['accepted', 'picked-up', 'delivering'].includes(delivery.status);
    if (filter === 'completed') return ['completed', 'cancelled'].includes(delivery.status);
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Deliveries</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
            >
              All
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

        <div className="grid gap-6">
          {filteredDeliveries.map((delivery) => (
            <div key={delivery.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{delivery.orderId}</h3>
                  <p className="text-gray-600">{delivery.customerName}</p>
                  <p className="text-sm text-gray-500">{delivery.address}</p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(delivery.status)}`}>
                    {delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1)}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">R{delivery.total.toFixed(2)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Fuel</p>
                  <p className="font-medium">{delivery.fuelLitres}L</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Store Items</p>
                  <p className="font-medium">{delivery.storeItems.length > 0 ? delivery.storeItems.join(', ') : 'None'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="font-medium">{delivery.createdAt}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Est. Delivery</p>
                  <p className="font-medium">{delivery.estimatedDelivery}</p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="flex space-x-4">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View Details
                  </button>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Contact Customer
                  </button>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Navigate
                  </button>
                </div>
                {getStatusActions(delivery)}
              </div>
            </div>
          ))}
        </div>

        {filteredDeliveries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No deliveries found for the selected filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverDeliveriesPage; 