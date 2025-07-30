import React, { useState } from "react";
import FuelOrderForm from "../components/FuelOrderForm";
import OrderSummary from "../components/OrderSummary";

// Dummy pricing engine (replace with real logic or API)
function calculateTotal({ fuelLitres, storeItemsTotal }: any) {
  const stationPrice = 25; // Example price per litre
  const deliveryFee = 20;
  const platformFee = 10;
  const orderDate = new Date();
  const loadSheddingStage = 2;
  const isAffluentArea = false;
  const isStressedArea = false;

  let baseFuelCost = fuelLitres * stationPrice;
  let subtotal = baseFuelCost + storeItemsTotal + deliveryFee + platformFee;

  const surcharge = loadSheddingStage >= 1 ? 5 : 0;
  subtotal += surcharge;

  const vatRate = orderDate >= new Date("2025-05-01") ? 0.16 : 0.15;
  const vatAmount = +(subtotal * vatRate).toFixed(2);
  let total = subtotal + vatAmount;

  if (isAffluentArea) total *= 1.05;
  if (isStressedArea) total *= 1.02;

  if (total < 100) {
    const adjustedFuelPrice = 100 / fuelLitres;
    total = adjustedFuelPrice * fuelLitres;
  }

  return {
    baseFuelCost,
    surcharge,
    vatAmount,
    total: +total.toFixed(2),
  };
}

const FuelOrderPage: React.FC = () => {
  const [summary, setSummary] = useState<null | any>(null);
  const [order, setOrder] = useState<any>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleCalculate = (orderData: any) => {
    const result = calculateTotal(orderData);
    setSummary(result);
    setOrder(orderData);
    setSubmitted(false);
  };

  const handleSubmitOrder = () => {
    // Here you would POST to your backend API
    // await fetch('/api/order', { method: 'POST', body: JSON.stringify({ ...order, ...summary }) })
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <FuelOrderForm onCalculate={handleCalculate} />
      <OrderSummary summary={summary} />
      {summary && !submitted && (
        <button
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          onClick={handleSubmitOrder}
        >
          Submit Order
        </button>
      )}
      {submitted && (
        <div className="mt-6 p-4 bg-green-100 text-green-800 rounded shadow">
          Order submitted! You’ll receive updates soon.
        </div>
      )}
    </div>
  );
};

export default FuelOrderPage;