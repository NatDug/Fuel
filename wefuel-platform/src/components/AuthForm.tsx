import React, { useState } from "react";
import { api, sessionStorage, handleApiError } from "../utils/api";
import "../styles/login.css";

interface AuthFormProps {
  onSuccess?: (user: { userId: string; email: string }) => void;
  mode?: 'login' | 'signup';
}

const AuthForm: React.FC<AuthFormProps> = ({ onSuccess, mode = 'login' }) => {
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: '',
    card: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let response;
      
      if (isLogin) {
        response = await api.login(formData.email, formData.password);
      } else {
        response = await api.signup(formData.email, formData.password, formData.phone, formData.card);
      }

      if (response.success && response.data) {
        // Store user session
        sessionStorage.setUser(response.data);
        
        // Call success callback
        if (onSuccess) {
          onSuccess(response.data);
        }
        
        // Show success message
        alert(isLogin ? 'Login successful!' : 'Account created successfully!');
      } else {
        setError(handleApiError(response.error || 'Authentication failed'));
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-background">
          {/* Background image will be applied via CSS */}
        </div>
        
        <div className="login-content">
          <div className="login-header">
            <h1 className="login-title">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="login-subtitle">
              {isLogin ? 'Sign in to your WeFuel account' : 'Join the WeFuel platform'}
            </p>
          </div>
          
          <form className="login-form" onSubmit={handleSubmit}>
            {error && (
              <div className="login-error">
                {error}
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter your email"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter your password"
              />
            </div>
            
            {!isLogin && (
              <>
                <div className="form-group">
                  <label htmlFor="phone" className="form-label">
                    Phone number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="card" className="form-label">
                    Payment card number
                  </label>
                  <input
                    id="card"
                    name="card"
                    type="text"
                    required
                    value={formData.card}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter your card number"
                  />
                </div>
              </>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="login-button"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>
          
          <div className="login-footer">
            <p className="login-switch-text">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="login-switch-button"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
      
      
    </div>
  );
};

export default AuthForm;