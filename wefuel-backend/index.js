const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// In-memory demo data
let users = [
  { id: 1, email: "test@wefuel.com", password: "test123", wallet: 320.5 }
];
let orders = [];
let transactions = [
  { id: 1, userId: 1, type: "Credit", amount: 150, date: "2024-06-01", desc: "Trip Earnings" },
  { id: 2, userId: 1, type: "Debit", amount: -50, date: "2024-05-30", desc: "Withdrawal" },
  { id: 3, userId: 1, type: "Credit", amount: 220.5, date: "2024-05-28", desc: "Referral Bonus" },
];

// --- Auth ---
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  res.json({ userId: user.id, email: user.email });
});

app.post('/api/signup', (req, res) => {
  const { email, password, phone, card } = req.body;
  // Check for unique email
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: "Email already exists" });
  }
  // Check for unique phone number
  if (users.find(u => u.phone === phone)) {
    return res.status(400).json({ error: "Phone number already exists" });
  }
  // Check card usage (max 3 accounts)
  const cardUsageCount = users.filter(u => u.card === card).length;
  if (cardUsageCount >= 3) {
    return res.status(400).json({ error: "Card already linked to 3 accounts" });
  }
  const newUser = { id: users.length + 1, email, password, phone, card, wallet: 0 };
  users.push(newUser);
  res.json({ userId: newUser.id, email: newUser.email });
});

// --- Place Order ---
app.post('/api/order', (req, res) => {
  const { userId, fuelLitres, storeItems, total } = req.body;
  const order = {
    id: orders.length + 1,
    userId,
    fuelLitres,
    storeItems,
    total,
    status: "pending",
    driverLocation: { lat: -26.2023, lng: 28.0436 }
  };
  orders.push(order);
  res.json({ orderId: order.id, status: order.status });
});

// --- Track Order ---
app.get('/api/track', (req, res) => {
  const { orderId } = req.query;
  const order = orders.find(o => o.id == orderId);
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json({
    status: order.status,
    driverLocation: order.driverLocation
  });
});

// --- Wallet ---
app.get('/api/wallet', (req, res) => {
  const { userId } = req.query;
  const user = users.find(u => u.id == userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  const userTx = transactions.filter(tx => tx.userId == user.id);
  res.json({ balance: user.wallet, transactions: userTx });
});

// --- Withdraw ---
app.post('/api/wallet/withdraw', (req, res) => {
  const { userId, amount } = req.body;
  const user = users.find(u => u.id == userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  if (user.wallet < amount) return res.status(400).json({ error: "Insufficient funds" });
  user.wallet -= amount;
  transactions.push({
    id: transactions.length + 1,
    userId: user.id,
    type: "Debit",
    amount: -amount,
    date: new Date().toISOString().slice(0, 10),
    desc: "Withdrawal"
  });
  res.json({ balance: user.wallet });
});

const PORT = 4000;
app.listen(PORT, () => console.log(`WeFuel backend running on port ${PORT}`));