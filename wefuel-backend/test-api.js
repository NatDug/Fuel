const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:4000/api';

// Test data
const testUsers = [
  {
    email: 'apitest1@wefuel.com',
    password: 'password123',
    phone: '+27123456789',
    card: '1234567890123456'
  },
  {
    email: 'apitest2@wefuel.com',
    password: 'password456',
    phone: '+27123456790',
    card: '1234567890123456' // Same card as user 1
  }
];

async function testAPI() {
  console.log('🚀 Starting API Tests...\n');

  try {
    // Test 1: Signup first user
    console.log('📝 Test 1: Signup first user');
    const signup1 = await fetch(`${BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUsers[0])
    });
    
    if (signup1.ok) {
      const result1 = await signup1.json();
      console.log('✅ User 1 created successfully:', result1);
    } else {
      const error1 = await signup1.json();
      console.log('❌ User 1 creation failed:', error1);
    }

    // Test 2: Try to signup with same email (should fail)
    console.log('\n📝 Test 2: Try to signup with same email');
    const duplicateEmail = await fetch(`${BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...testUsers[0],
        phone: '+27123456792',
        card: '9876543210987654'
      })
    });
    
    if (duplicateEmail.ok) {
      console.log('❌ Should have failed - duplicate email');
    } else {
      const error2 = await duplicateEmail.json();
      console.log('✅ Correctly rejected duplicate email:', error2.error);
    }

    // Test 3: Try to signup with same phone (should fail)
    console.log('\n📝 Test 3: Try to signup with same phone');
    const duplicatePhone = await fetch(`${BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...testUsers[1],
        email: 'different@wefuel.com'
      })
    });
    
    if (duplicatePhone.ok) {
      console.log('❌ Should have failed - duplicate phone');
    } else {
      const error3 = await duplicatePhone.json();
      console.log('✅ Correctly rejected duplicate phone:', error3.error);
    }

    // Test 4: Signup second user with same card
    console.log('\n📝 Test 4: Signup second user with same card');
    const signup2 = await fetch(`${BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUsers[1])
    });
    
    if (signup2.ok) {
      const result2 = await signup2.json();
      console.log('✅ User 2 created successfully (same card):', result2);
    } else {
      const error4 = await signup2.json();
      console.log('❌ User 2 creation failed:', error4);
    }

    // Test 5: Login with correct credentials
    console.log('\n📝 Test 5: Login with correct credentials');
    const login1 = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUsers[0].email,
        password: testUsers[0].password
      })
    });
    
    if (login1.ok) {
      const result3 = await login1.json();
      console.log('✅ Login successful:', result3);
    } else {
      const error5 = await login1.json();
      console.log('❌ Login failed:', error5);
    }

    // Test 6: Login with wrong password
    console.log('\n📝 Test 6: Login with wrong password');
    const wrongPassword = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUsers[0].email,
        password: 'wrongpassword'
      })
    });
    
    if (wrongPassword.ok) {
      console.log('❌ Should have failed - wrong password');
    } else {
      const error6 = await wrongPassword.json();
      console.log('✅ Correctly rejected wrong password:', error6.error);
    }

    // Test 7: Login with non-existent email
    console.log('\n📝 Test 7: Login with non-existent email');
    const nonExistent = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'nonexistent@wefuel.com',
        password: 'password123'
      })
    });
    
    if (nonExistent.ok) {
      console.log('❌ Should have failed - user does not exist');
    } else {
      const error7 = await nonExistent.json();
      console.log('✅ Correctly rejected non-existent user:', error7.error);
    }

    console.log('\n🎉 API Tests completed!');

  } catch (error) {
    console.error('❌ API test failed:', error.message);
    console.log('💡 Make sure the backend server is running on port 4000');
  }
}

// Run the test
testAPI(); 