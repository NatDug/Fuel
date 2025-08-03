import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SplashScreen from "../components/SplashScreen";

const SplashPage: React.FC = () => {
  const [showOptions, setShowOptions] = useState(false);
  const navigate = useNavigate();

  const handleSplashComplete = () => {
    setShowOptions(true);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleExplore = () => {
    navigate('/main-menu');
  };

  if (!showOptions) {
    return <SplashScreen onComplete={handleSplashComplete} duration={3000} />;
  }

  return (
    <div className="splash-landing-container">
      <div className="splash-landing-wrapper">
        <div className="splash-landing-background">
          {/* Background gradient and patterns */}
        </div>
        
        <div className="splash-landing-content">
          {/* Logo and Brand */}
          <div className="splash-landing-logo">
            <div className="logo-icon">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="80" height="80" rx="20" fill="url(#logoGradient)"/>
                <g transform="translate(20, 15)">
                  <rect x="-10" y="-20" width="20" height="40" rx="3" fill="white"/>
                  <rect x="-7" y="-17" width="14" height="34" rx="2" fill="#667eea"/>
                  <circle cx="0" cy="-7" r="5" fill="white"/>
                  <rect x="-3" y="7" width="6" height="10" fill="white"/>
                </g>
                <defs>
                  <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#667eea', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#764ba2', stopOpacity: 1}} />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h1 className="splash-landing-title">WeFuel</h1>
            <p className="splash-landing-subtitle">Your Fuel Delivery Partner</p>
          </div>

          {/* Welcome Message */}
          <div className="splash-landing-welcome">
            <h2 className="welcome-title">Welcome to WeFuel</h2>
            <p className="welcome-subtitle">
              Experience the future of fuel delivery. Order fuel, track deliveries, and manage your account with ease.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="splash-landing-actions">
            <button 
              className="action-button primary"
              onClick={handleLogin}
            >
              <span className="button-icon">🔐</span>
              <span className="button-text">Login / Sign Up</span>
            </button>
            
            <button 
              className="action-button secondary"
              onClick={handleExplore}
            >
              <span className="button-icon">🚀</span>
              <span className="button-text">Explore App</span>
            </button>
          </div>

          {/* App Features */}
          <div className="splash-landing-features">
            <div className="feature-item">
              <span className="feature-icon">⛽</span>
              <span className="feature-text">Quick Fuel Orders</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🚚</span>
              <span className="feature-text">Fast Delivery</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">💳</span>
              <span className="feature-text">Secure Payments</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📱</span>
              <span className="feature-text">Real-time Tracking</span>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .splash-landing-container {
          position: relative;
          width: 100%;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          overflow: hidden;
        }

        .splash-landing-wrapper {
          position: relative;
          width: 414px;
          height: 896px;
          max-width: 100%;
          max-height: 100vh;
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .splash-landing-background {
          position: absolute;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(circle at 25% 25%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(118, 75, 162, 0.1) 0%, transparent 50%),
            linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          opacity: 0.1;
          z-index: 1;
        }

        .splash-landing-content {
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 30px;
          background: rgba(255, 255, 255, 0.95);
        }

        .splash-landing-logo {
          text-align: center;
          margin-bottom: 40px;
        }

        .logo-icon {
          margin-bottom: 20px;
        }

        .splash-landing-title {
          font-size: 36px;
          font-weight: 800;
          color: #1a202c;
          margin: 0 0 8px 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .splash-landing-subtitle {
          font-size: 18px;
          color: #718096;
          margin: 0;
          font-weight: 500;
        }

        .splash-landing-welcome {
          text-align: center;
          margin-bottom: 40px;
        }

        .welcome-title {
          font-size: 24px;
          font-weight: 700;
          color: #1a202c;
          margin: 0 0 12px 0;
        }

        .welcome-subtitle {
          font-size: 16px;
          color: #718096;
          margin: 0;
          line-height: 1.5;
        }

        .splash-landing-actions {
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: 100%;
          margin-bottom: 40px;
        }

        .action-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          width: 100%;
          padding: 16px 24px;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .action-button.primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .action-button.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        .action-button.secondary {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          border: 2px solid rgba(102, 126, 234, 0.2);
        }

        .action-button.secondary:hover {
          background: rgba(102, 126, 234, 0.15);
          border-color: rgba(102, 126, 234, 0.3);
          transform: translateY(-1px);
        }

        .button-icon {
          font-size: 20px;
        }

        .button-text {
          font-size: 16px;
          font-weight: 600;
        }

        .splash-landing-features {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          width: 100%;
        }

        .feature-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 16px 12px;
          background: rgba(102, 126, 234, 0.05);
          border-radius: 12px;
          border: 1px solid rgba(102, 126, 234, 0.1);
          text-align: center;
        }

        .feature-icon {
          font-size: 24px;
        }

        .feature-text {
          font-size: 12px;
          color: #2d3748;
          font-weight: 500;
          line-height: 1.2;
        }

        /* Mobile responsive adjustments */
        @media (max-width: 480px) {
          .splash-landing-wrapper {
            width: 100%;
            height: 100vh;
            border-radius: 0;
            box-shadow: none;
          }
          
          .splash-landing-content {
            padding: 20px;
          }
          
          .splash-landing-title {
            font-size: 32px;
          }
          
          .splash-landing-subtitle {
            font-size: 16px;
          }

          .welcome-title {
            font-size: 22px;
          }

          .welcome-subtitle {
            font-size: 14px;
          }

          .splash-landing-features {
            grid-template-columns: 1fr;
            gap: 8px;
          }
        }

        /* Tablet responsive adjustments */
        @media (min-width: 481px) and (max-width: 768px) {
          .splash-landing-wrapper {
            width: 480px;
            height: 800px;
          }
        }

        /* Desktop responsive adjustments */
        @media (min-width: 769px) {
          .splash-landing-wrapper {
            width: 414px;
            height: 896px;
          }
        }
      `}</style>
    </div>
  );
};

export default SplashPage; 