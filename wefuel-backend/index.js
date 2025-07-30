const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });

// Import models
const User = require('./models/User');
const Order = require('./models/Order');
const Transaction = require('./models/Transaction');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wefuel', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// --- Auth ---
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    res.json({ userId: user._id, email: user.email });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post('/api/signup', async (req, res) => {
  try {
    const { email, password, phone, card } = req.body;
    
    // Check for unique email
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }
    
    // Check for unique phone number
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({ error: "Phone number already exists" });
    }
    
    // Check card usage (max 3 accounts)
    const cardUsageCount = await User.countDocuments({ card });
    if (cardUsageCount >= 3) {
      return res.status(400).json({ error: "Card already linked to 3 accounts" });
    }
    
    const newUser = new User({
      email: email.toLowerCase(),
      password,
      phone,
      card,
      wallet: 0
    });
    
    await newUser.save();
    res.json({ userId: newUser._id, email: newUser.email });
  } catch (error) {
    console.error('Signup error:', error);
    if (error.code === 11000) {
      // Duplicate key error
      const field = Object.keys(error.keyPattern)[0];
      res.status(400).json({ error: `${field} already exists` });
    } else {
      res.status(500).json({ error: "Server error" });
    }
  }
});

// --- Place Order ---
app.post('/api/order', async (req, res) => {
  try {
    const { userId, fuelLitres, storeItems, total } = req.body;
    
    const order = new Order({
      userId,
      fuelLitres,
      storeItems,
      total,
      status: "pending",
      driverLocation: { lat: -26.2023, lng: 28.0436 }
    });
    
    await order.save();
    res.json({ orderId: order._id, status: order.status });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: "Server error" });
  }
});

// --- Track Order ---
app.get('/api/track', async (req, res) => {
  try {
    const { orderId } = req.query;
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    res.json({
      status: order.status,
      driverLocation: order.driverLocation
    });
  } catch (error) {
    console.error('Track order error:', error);
    res.status(500).json({ error: "Server error" });
  }
});

// --- Wallet ---
app.get('/api/wallet', async (req, res) => {
  try {
    const { userId } = req.query;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    const transactions = await Transaction.find({ userId }).sort({ date: -1 });
    res.json({ balance: user.wallet, transactions });
  } catch (error) {
    console.error('Wallet error:', error);
    res.status(500).json({ error: "Server error" });
  }
});

// --- Withdraw ---
app.post('/api/wallet/withdraw', async (req, res) => {
  try {
    const { userId, amount } = req.body;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    if (user.wallet < amount) {
      return res.status(400).json({ error: "Insufficient funds" });
    }
    
    // Update user wallet
    user.wallet -= amount;
    await user.save();
    
    // Create transaction record
    const transaction = new Transaction({
      userId,
      type: "Debit",
      amount: -amount,
      desc: "Withdrawal"
    });
    
    await transaction.save();
    res.json({ balance: user.wallet });
  } catch (error) {
    console.error('Withdrawal error:', error);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`WeFuel backend running on port ${PORT}`));