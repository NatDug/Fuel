// API Configuration and Utilities for WeFuel Platform

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface User {
  _id: string;
  email: string;
  phone: string;
  wallet: number;
  userType?: 'customer' | 'driver' | 'station' | 'admin';
}

export interface Order {
  _id: string;
  userId: string;
  fuelLitres: number;
  storeItems: any[];
  total: number;
  status: 'pending' | 'confirmed' | 'in-transit' | 'delivered' | 'cancelled';
  driverLocation?: {
    lat: number;
    lng: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  _id: string;
  userId: string;
  type: 'Credit' | 'Debit';
  amount: number;
  desc: string;
  date: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  phone: string;
  card: string;
}

export interface OrderRequest {
  userId: string;
  fuelLitres: number;
  storeItems: any[];
  total: number;
}

export interface WithdrawRequest {
  userId: string;
  amount: number;
}

// API Client Class
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Authentication APIs
  async login(credentials: LoginRequest): Promise<ApiResponse<{ userId: string; email: string }>> {
    return this.request('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async signup(userData: SignupRequest): Promise<ApiResponse<{ userId: string; email: string }>> {
    return this.request('/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Order APIs
  async placeOrder(orderData: OrderRequest): Promise<ApiResponse<{ orderId: string; status: string }>> {
    return this.request('/order', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async trackOrder(orderId: string): Promise<ApiResponse<{ status: string; driverLocation: { lat: number; lng: number } }>> {
    return this.request(`/track?orderId=${orderId}`, {
      method: 'GET',
    });
  }

  // Wallet APIs
  async getWallet(userId: string): Promise<ApiResponse<{ balance: number; transactions: Transaction[] }>> {
    return this.request(`/wallet?userId=${userId}`, {
      method: 'GET',
    });
  }

  async withdrawFunds(withdrawData: WithdrawRequest): Promise<ApiResponse<{ balance: number }>> {
    return this.request('/wallet/withdraw', {
      method: 'POST',
      body: JSON.stringify(withdrawData),
    });
  }

  // Health Check
  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    return this.request('/health', {
      method: 'GET',
    });
  }
}

// Create and export API client instance
export const apiClient = new ApiClient();

// Utility functions for common API operations
export const api = {
  // Authentication
  login: (email: string, password: string) => 
    apiClient.login({ email, password }),
  
  signup: (email: string, password: string, phone: string, card: string) => 
    apiClient.signup({ email, password, phone, card }),

  // Orders
  placeOrder: (userId: string, fuelLitres: number, storeItems: any[], total: number) => 
    apiClient.placeOrder({ userId, fuelLitres, storeItems, total }),
  
  trackOrder: (orderId: string) => 
    apiClient.trackOrder(orderId),

  // Wallet
  getWallet: (userId: string) => 
    apiClient.getWallet(userId),
  
  withdrawFunds: (userId: string, amount: number) => 
    apiClient.withdrawFunds({ userId, amount }),

  // Health
  healthCheck: () => 
    apiClient.healthCheck(),
};

// Local storage utilities for session management
export const sessionStorage = {
  setUser: (user: { userId: string; email: string }) => {
    localStorage.setItem('wefuel_user', JSON.stringify(user));
  },

  getUser: (): { userId: string; email: string } | null => {
    const user = localStorage.getItem('wefuel_user');
    return user ? JSON.parse(user) : null;
  },

  clearUser: () => {
    localStorage.removeItem('wefuel_user');
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('wefuel_user');
  },
};

// Error handling utilities
export const handleApiError = (error: string): string => {
  const errorMessages: { [key: string]: string } = {
    'Invalid credentials': 'Invalid email or password',
    'Email already exists': 'An account with this email already exists',
    'Phone number already exists': 'This phone number is already registered',
    'Card already linked to 3 accounts': 'This payment card is already linked to 3 accounts',
    'Insufficient funds': 'Insufficient funds in wallet',
    'Order not found': 'Order not found',
    'User not found': 'User not found',
  };

  return errorMessages[error] || error || 'An unexpected error occurred';
};

export default apiClient; 