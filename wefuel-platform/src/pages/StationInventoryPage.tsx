import React, { useState } from "react";

interface FuelTank {
  id: string;
  type: string;
  currentLevel: number;
  capacity: number;
  price: number;
  status: 'available' | 'low' | 'out';
  lastUpdated: string;
  supplier: string;
  reorderPoint: number;
}

interface StockAlert {
  id: string;
  tankId: string;
  fuelType: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  resolved: boolean;
}

const mockFuelTanks: FuelTank[] = [
  {
    id: '1',
    type: 'Petrol 95',
    currentLevel: 2500,
    capacity: 5000,
    price: 23.50,
    status: 'available',
    lastUpdated: '2024-01-15 10:30',
    supplier: 'Shell SA',
    reorderPoint: 1000
  },
  {
    id: '2',
    type: 'Petrol 93',
    currentLevel: 1800,
    capacity: 5000,
    price: 22.80,
    status: 'available',
    lastUpdated: '2024-01-15 10:30',
    supplier: 'Shell SA',
    reorderPoint: 1000
  },
  {
    id: '3',
    type: 'Diesel 50ppm',
    currentLevel: 800,
    capacity: 5000,
    price: 21.20,
    status: 'low',
    lastUpdated: '2024-01-15 10:30',
    supplier: 'BP SA',
    reorderPoint: 1000
  },
  {
    id: '4',
    type: 'Diesel 500ppm',
    currentLevel: 0,
    capacity: 5000,
    price: 20.50,
    status: 'out',
    lastUpdated: '2024-01-15 10:30',
    supplier: 'BP SA',
    reorderPoint: 1000
  }
];

const mockStockAlerts: StockAlert[] = [
  {
    id: '1',
    tankId: '3',
    fuelType: 'Diesel 50ppm',
    message: 'Fuel level below reorder point (800L remaining)',
    priority: 'medium',
    createdAt: '2024-01-15 09:00',
    resolved: false
  },
  {
    id: '2',
    tankId: '4',
    fuelType: 'Diesel 500ppm',
    message: 'Tank is empty - immediate refill required',
    priority: 'high',
    createdAt: '2024-01-15 08:30',
    resolved: false
  }
];

const StationInventoryPage: React.FC = () => {
  const [tanks, setTanks] = useState<FuelTank[]>(mockFuelTanks);
  const [alerts, setAlerts] = useState<StockAlert[]>(mockStockAlerts);
  const [selectedTank, setSelectedTank] = useState<FuelTank | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    level: '',
    price: ''
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-600 bg-green-100';
      case 'low': return 'text-yellow-600 bg-yellow-100';
      case 'out': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getInventoryPercentage = (current: number, capacity: number) => {
    return (current / capacity) * 100;
  };

  const openUpdateModal = (tank: FuelTank) => {
    setSelectedTank(tank);
    setUpdateForm({
      level: tank.currentLevel.toString(),
      price: tank.price.toString()
    });
    setShowUpdateModal(true);
  };

  const handleUpdate = () => {
    if (selectedTank) {
      const newLevel = parseFloat(updateForm.level);
      const newPrice = parseFloat(updateForm.price);
      
      let newStatus = 'available';
      if (newLevel === 0) newStatus = 'out';
      else if (newLevel <= selectedTank.reorderPoint) newStatus = 'low';

      setTanks(prev => prev.map(tank => 
        tank.id === selectedTank.id 
          ? { 
              ...tank, 
              currentLevel: newLevel, 
              price: newPrice, 
              status: newStatus,
              lastUpdated: new Date().toLocaleString()
            }
          : tank
      ));
      
      setShowUpdateModal(false);
      setSelectedTank(null);
    }
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Fuel Inventory Management</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Add New Tank
          </button>
        </div>

        {/* Stock Alerts */}
        {alerts.filter(alert => !alert.resolved).length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Stock Alerts</h2>
            <div className="space-y-3">
              {alerts.filter(alert => !alert.resolved).map((alert) => (
                <div key={alert.id} className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{alert.fuelType}</p>
                    <p className="text-sm text-gray-600">{alert.message}</p>
                    <p className="text-xs text-gray-500">{alert.createdAt}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(alert.priority)}`}>
                      {alert.priority.charAt(0).toUpperCase() + alert.priority.slice(1)}
                    </span>
                    <button
                      onClick={() => resolveAlert(alert.id)}
                      className="text-green-600 hover:text-green-800 text-sm font-medium"
                    >
                      Resolve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fuel Tanks */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">Fuel Tanks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tanks.map((tank) => (
              <div key={tank.id} className="border rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{tank.type}</h3>
                    <p className="text-sm text-gray-600">{tank.supplier}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tank.status)}`}>
                    {tank.status.charAt(0).toUpperCase() + tank.status.slice(1)}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Current Level</span>
                      <span>{tank.currentLevel}L / {tank.capacity}L</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          tank.status === 'available' ? 'bg-green-500' :
                          tank.status === 'low' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${getInventoryPercentage(tank.currentLevel, tank.capacity)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {getInventoryPercentage(tank.currentLevel, tank.capacity).toFixed(1)}% full
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Price per Liter</p>
                      <p className="font-medium">R{tank.price.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Reorder Point</p>
                      <p className="font-medium">{tank.reorderPoint}L</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-500 text-sm">Total Value</p>
                    <p className="font-medium text-lg">
                      R{(tank.currentLevel * tank.price).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => openUpdateModal(tank)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 text-sm"
                  >
                    Update Levels
                  </button>
                  <button className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300 text-sm">
                    Order Fuel
                  </button>
                </div>

                <div className="mt-3 text-xs text-gray-500">
                  Last updated: {tank.lastUpdated}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Summary */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Inventory Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {tanks.filter(t => t.status === 'available').length}
              </div>
              <p className="text-sm text-gray-600">Available Tanks</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {tanks.filter(t => t.status === 'low').length}
              </div>
              <p className="text-sm text-gray-600">Low Stock</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {tanks.filter(t => t.status === 'out').length}
              </div>
              <p className="text-sm text-gray-600">Out of Stock</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                R{tanks.reduce((sum, tank) => sum + (tank.currentLevel * tank.price), 0).toFixed(2)}
              </div>
              <p className="text-sm text-gray-600">Total Value</p>
            </div>
          </div>
        </div>

        {/* Update Modal */}
        {showUpdateModal && selectedTank && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">
                Update {selectedTank.type} Tank
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Level (L)
                  </label>
                  <input
                    type="number"
                    value={updateForm.level}
                    onChange={(e) => setUpdateForm(prev => ({ ...prev, level: e.target.value }))}
                    className="w-full border rounded px-3 py-2"
                    min="0"
                    max={selectedTank.capacity}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price per Liter (R)
                  </label>
                  <input
                    type="number"
                    value={updateForm.price}
                    onChange={(e) => setUpdateForm(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full border rounded px-3 py-2"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowUpdateModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StationInventoryPage; 