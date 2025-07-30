# WeFuel Backend

A Node.js/Express backend with MongoDB for the WeFuel platform.

## Features

- User authentication (signup/login)
- Unique email and phone constraints
- Card usage limits (max 3 accounts per card)
- Order management
- Wallet system with transactions
- Real-time order tracking

## Prerequisites

1. **Node.js** (v14 or higher)
2. **MongoDB** (local installation or MongoDB Atlas)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up MongoDB:
   - **Local MongoDB**: Install and start MongoDB service
   - **MongoDB Atlas**: Get connection string and update `config.env`

3. Configure environment variables in `config.env`:
```
MONGODB_URI=mongodb://localhost:27017/wefuel
PORT=4000
```

## Running the Server

### Development mode (with auto-restart):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

## Testing the Signup/Login Flow

### Option 1: Database Tests (Direct MongoDB)
```bash
node test-signup-login.js
```

This test verifies:
- ✅ Unique email constraint
- ✅ Unique phone constraint  
- ✅ Max 3 accounts per card
- ✅ Login validation

### Option 2: API Tests (HTTP requests)
```bash
node test-api.js
```

This test makes actual HTTP requests to test:
- ✅ Signup endpoint
- ✅ Login endpoint
- ✅ Error handling
- ✅ Validation rules

### Option 3: Manual Testing with Frontend

1. Start the backend server
2. Update frontend API calls to use `http://localhost:4000/api`
3. Test signup/login through the UI

## API Endpoints

### Authentication
- `POST /api/signup` - Create new user account
- `POST /api/login` - User login

### Orders
- `POST /api/order` - Place new order
- `GET /api/track` - Track order status

### Wallet
- `GET /api/wallet` - Get wallet balance and transactions
- `POST /api/wallet/withdraw` - Request withdrawal

## Database Models

### User
- `email` (unique, required)
- `phone` (unique, required)
- `card` (required, max 3 accounts)
- `password` (required)
- `wallet` (default: 0)

### Order
- `userId` (reference to User)
- `fuelLitres` (5-25L)
- `storeItems` (array)
- `total` (required)
- `status` (pending/accepted/delivering/completed/cancelled)
- `driverLocation` (lat/lng)

### Transaction
- `userId` (reference to User)
- `type` (Credit/Debit)
- `amount` (required)
- `desc` (required)
- `date` (auto-generated)

## Validation Rules

1. **Email**: Must be unique across all users
2. **Phone**: Must be unique across all users
3. **Card**: Can be linked to maximum 3 accounts
4. **Password**: Required for authentication

## Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `400` - Bad request (validation errors)
- `401` - Unauthorized (login failed)
- `404` - Not found
- `500` - Server error

## Next Steps

1. Add password hashing (bcrypt)
2. Implement JWT authentication
3. Add input validation middleware
4. Set up proper logging
5. Add rate limiting
6. Implement file upload for FICA documents 