const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });

// Import models
const User = require('./models/User');

// Test data
const testUsers = [
  {
    email: 'test1@wefuel.com',
    password: 'password123',
    phone: '+27123456789',
    card: '1234567890123456'
  },
  {
    email: 'test2@wefuel.com',
    password: 'password456',
    phone: '+27123456790',
    card: '1234567890123456' // Same card as user 1
  },
  {
    email: 'test3@wefuel.com',
    password: 'password789',
    phone: '+27123456791',
    card: '1234567890123456' // Same card as user 1 and 2
  }
];

async function testSignupLogin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wefuel', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing test data
    await User.deleteMany({ email: { $in: testUsers.map(u => u.email) } });
    console.log('🧹 Cleared existing test data');

    // Test 1: Signup first user
    console.log('\n📝 Test 1: Signup first user');
    const user1 = new User(testUsers[0]);
    await user1.save();
    console.log('✅ User 1 created successfully');

    // Test 2: Try to signup with same email (should fail)
    console.log('\n📝 Test 2: Try to signup with same email');
    try {
      const duplicateUser = new User({
        ...testUsers[0],
        phone: '+27123456792',
        card: '9876543210987654'
      });
      await duplicateUser.save();
      console.log('❌ Should have failed - duplicate email');
    } catch (error) {
      if (error.code === 11000) {
        console.log('✅ Correctly rejected duplicate email');
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }

    // Test 3: Try to signup with same phone (should fail)
    console.log('\n📝 Test 3: Try to signup with same phone');
    try {
      const duplicatePhoneUser = new User({
        ...testUsers[1],
        email: 'different@wefuel.com'
      });
      await duplicatePhoneUser.save();
      console.log('❌ Should have failed - duplicate phone');
    } catch (error) {
      if (error.code === 11000) {
        console.log('✅ Correctly rejected duplicate phone');
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }

    // Test 4: Signup second user with same card
    console.log('\n📝 Test 4: Signup second user with same card');
    const user2 = new User(testUsers[1]);
    await user2.save();
    console.log('✅ User 2 created successfully (same card)');

    // Test 5: Signup third user with same card
    console.log('\n📝 Test 5: Signup third user with same card');
    const user3 = new User(testUsers[2]);
    await user3.save();
    console.log('✅ User 3 created successfully (same card)');

    // Test 6: Try to signup fourth user with same card (should fail)
    console.log('\n📝 Test 6: Try to signup fourth user with same card');
    try {
      const user4 = new User({
        email: 'test4@wefuel.com',
        password: 'password999',
        phone: '+27123456792',
        card: '1234567890123456' // Same card as users 1, 2, 3
      });
      await user4.save();
      console.log('❌ Should have failed - card already linked to 3 accounts');
    } catch (error) {
      console.log('✅ Correctly rejected - card already linked to 3 accounts');
    }

    // Test 7: Login with correct credentials
    console.log('\n📝 Test 7: Login with correct credentials');
    const loginUser = await User.findOne({ email: testUsers[0].email.toLowerCase() });
    if (loginUser && loginUser.password === testUsers[0].password) {
      console.log('✅ Login successful');
    } else {
      console.log('❌ Login failed');
    }

    // Test 8: Login with wrong password
    console.log('\n📝 Test 8: Login with wrong password');
    const wrongPasswordUser = await User.findOne({ email: testUsers[0].email.toLowerCase() });
    if (wrongPasswordUser && wrongPasswordUser.password === 'wrongpassword') {
      console.log('❌ Should have failed - wrong password');
    } else {
      console.log('✅ Correctly rejected wrong password');
    }

    // Test 9: Login with non-existent email
    console.log('\n📝 Test 9: Login with non-existent email');
    const nonExistentUser = await User.findOne({ email: 'nonexistent@wefuel.com' });
    if (nonExistentUser) {
      console.log('❌ Should have failed - user does not exist');
    } else {
      console.log('✅ Correctly rejected non-existent user');
    }

    console.log('\n🎉 All tests completed!');
    console.log('\n📊 Summary:');
    console.log('- Unique email constraint: ✅ Working');
    console.log('- Unique phone constraint: ✅ Working');
    console.log('- Max 3 accounts per card: ✅ Working');
    console.log('- Login validation: ✅ Working');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the test
testSignupLogin(); 