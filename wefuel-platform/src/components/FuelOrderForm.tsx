import React, { useState } from "react";

type StoreItem = { id: string; name: string; price: number };

const storeItems: StoreItem[] = [
  { id: "snack", name: "Snack Pack", price: 25 },
  { id: "drink", name: "Cold Drink", price: 15 },
  { id: "carwash", name: "Car Wash", price: 50 },
];

type Props = {
  onCalculate: (order: any) => void;
};

const FuelOrderForm: React.FC<Props> = ({ onCalculate }) => {
  const [fuelLitres, setFuelLitres] = useState(5);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleStoreItemChange = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const items = storeItems.filter((item) => selectedItems.includes(item.id));
    onCalculate({
      fuelLitres,
      storeItems: items,
      storeItemsTotal: items.reduce((sum, item) => sum + item.price, 0),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-md mx-auto mt-8 space-y-4">
      <h2 className="text-xl font-bold mb-2">Order Fuel</h2>
      <label className="block">
        Litres (5–25):
        <input
          type="number"
          min={5}
          max={25}
          value={fuelLitres}
          onChange={(e) => setFuelLitres(Number(e.target.value))}
          className="w-full border p-2 rounded mt-1"
          required
        />
      </label>
      <div>
        <div className="font-medium mb-1">Add Store Items:</div>
        {storeItems.map((item) => (
          <label key={item.id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedItems.includes(item.id)}
              onChange={() => handleStoreItemChange(item.id)}
            />
            <span>{item.name} (+R{item.price})</span>
          </label>
        ))}
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Calculate Total
      </button>
    </form>
  );
};

export default FuelOrderForm;