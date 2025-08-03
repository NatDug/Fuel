import React, { useState } from "react";
import { api, handleApiError } from "../utils/api";

interface FuelOrderFormProps {
  onOrderPlaced?: (orderId: string) => void;
  userId?: string;
}

const FuelOrderForm: React.FC<FuelOrderFormProps> = ({ onOrderPlaced, userId }) => {
  const [formData, setFormData] = useState({
    fuelType: 'Petrol 95',
    quantity: '',
    deliveryAddress: '',
    storeItems: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fuelTypes = [
    { value: 'Petrol 95', price: 23.50 },
    { value: 'Petrol 93', price: 22.80 },
    { value: 'Diesel', price: 21.90 }
  ];

  const selectedFuel = fuelTypes.find(f => f.value === formData.fuelType);
  const total = selectedFuel ? selectedFuel.price * (parseFloat(formData.quantity) || 0) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      setError('Please log in to place an order');
      return;
    }

    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      setError('Please enter a valid quantity');
      return;
    }

    if (!formData.deliveryAddress.trim()) {
      setError('Please enter a delivery address');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.placeOrder(
        userId,
        parseFloat(formData.quantity),
        formData.storeItems,
        total
      );

      if (response.success && response.data) {
        setSuccess(`Order placed successfully! Order ID: ${response.data.orderId}`);
        
        // Reset form
        setFormData({
          fuelType: 'Petrol 95',
          quantity: '',
          deliveryAddress: '',
          storeItems: []
        });

        // Call success callback
        if (onOrderPlaced) {
          onOrderPlaced(response.data.orderId);
        }
      } else {
        setError(handleApiError(response.error || 'Failed to place order'));
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Order error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Place Fuel Order</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fuel Type
            </label>
            <select
              name="fuelType"
              value={formData.fuelType}
              onChange={handleInputChange}
              className="input-field"
            >
              {fuelTypes.map(fuel => (
                <option key={fuel.value} value={fuel.value}>
                  {fuel.value} - R{fuel.price.toFixed(2)}/L
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity (Liters)
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              className="input-field"
              placeholder="50"
              min="1"
              step="0.1"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Delivery Address
          </label>
          <textarea
            name="deliveryAddress"
            value={formData.deliveryAddress}
            onChange={handleInputChange}
            className="input-field"
            rows={3}
            placeholder="Enter your delivery address"
          />
        </div>

        {total > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Fuel Type:</span>
                <span>{formData.fuelType}</span>
              </div>
              <div className="flex justify-between">
                <span>Quantity:</span>
                <span>{formData.quantity} liters</span>
              </div>
              <div className="flex justify-between">
                <span>Price per liter:</span>
                <span>R{selectedFuel?.price.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>R{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !userId}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FuelOrderForm;