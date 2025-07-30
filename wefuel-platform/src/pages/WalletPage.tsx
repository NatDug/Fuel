import React, { useState } from "react";

const dummyWallet = {
  balance: 320.50,
  transactions: [
    { id: 1, type: "Credit", amount: 150, date: "2024-06-01", desc: "Trip Earnings" },
    { id: 2, type: "Debit", amount: -50, date: "2024-05-30", desc: "Withdrawal" },
    { id: 3, type: "Credit", amount: 220.50, date: "2024-05-28", desc: "Referral Bonus" },
  ],
};

const WalletPage: React.FC = () => {
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMsg, setWithdrawMsg] = useState("");

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would POST to your backend
    setWithdrawMsg(`Withdrawal of R${withdrawAmount} requested!`);
    setWithdrawAmount("");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-12">
      <div className="bg-white p-6 rounded shadow max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Wallet</h2>
        <div className="text-lg mb-6">
          <span className="font-semibold">Balance:</span> R{dummyWallet.balance.toFixed(2)}
        </div>
        <h3 className="font-semibold mb-2">Recent Transactions</h3>
        <ul>
          {dummyWallet.transactions.map(tx => (
            <li key={tx.id} className="flex justify-between border-b py-2">
              <span>{tx.desc}</span>
              <span className={tx.amount > 0 ? "text-green-600" : "text-red-600"}>
                {tx.amount > 0 ? "+" : ""}R{tx.amount.toFixed(2)}
              </span>
              <span className="text-gray-500 text-sm">{tx.date}</span>
            </li>
          ))}
        </ul>
        <form onSubmit={handleWithdraw} className="mt-6">
          <label className="block mb-1 font-medium">Withdraw Amount (R)</label>
          <input
            type="number"
            min={1}
            max={dummyWallet.balance}
            value={withdrawAmount}
            onChange={e => setWithdrawAmount(e.target.value)}
            className="w-full border p-2 rounded mb-2"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Request Withdrawal
          </button>
          {withdrawMsg && (
            <div className="mt-2 text-green-700">{withdrawMsg}</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default WalletPage;