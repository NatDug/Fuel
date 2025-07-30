import React from "react";

type Props = {
  summary: {
    baseFuelCost: number;
    surcharge: number;
    vatAmount: number;
    total: number;
  } | null;
};

const OrderSummary: React.FC<Props> = ({ summary }) => {
  if (!summary) return null;
  return (
    <div className="bg-gray-100 p-4 rounded shadow max-w-md mx-auto mt-4">
      <h3 className="font-bold mb-2">Order Summary</h3>
      <div>Fuel: R{summary.baseFuelCost.toFixed(2)}</div>
      <div>Surcharge: R{summary.surcharge.toFixed(2)}</div>
      <div>VAT: R{summary.vatAmount.toFixed(2)}</div>
      <div className="font-bold mt-2">Total: R{summary.total.toFixed(2)}</div>
    </div>
  );
};

export default OrderSummary;