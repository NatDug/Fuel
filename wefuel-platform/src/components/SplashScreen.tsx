import React, { useEffect, useState } from "react";

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ 
  onComplete, 
  duration = 3000 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(interval);
        setIsVisible(false);
        setTimeout(() => {
          onComplete();
        }, 500); // Fade out delay
      }
    }, 50);

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="splash-container">
      <div className="splash-wrapper">
        <div className="splash-background">
          {/* Background gradient and patterns */}
        </div>
        
        <div className="splash-content">
          {/* Logo and Brand */}
          <div className="splash-logo">
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
            <h1 className="splash-title">WeFuel</h1>
            <p className="splash-subtitle">Fuel Delivery Platform</p>
          </div>

          {/* Loading Animation */}
          <div className="splash-loading">
            <div className="loading-spinner">
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
            </div>
            <p className="loading-text">Loading...</p>
          </div>

          {/* Progress Bar */}
          <div className="splash-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="progress-text">{Math.round(progress)}%</p>
          </div>

          {/* App Features Preview */}
          <div className="splash-features">
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
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .splash-container {
          position: relative;
          width: 100%;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          overflow: hidden;
        }

        .splash-wrapper {
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

        .splash-background {
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

        .splash-content {
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

        .splash-logo {
          text-align: center;
          margin-bottom: 60px;
        }

        .logo-icon {
          margin-bottom: 20px;
        }

        .splash-title {
          font-size: 36px;
          font-weight: 800;
          color: #1a202c;
          margin: 0 0 8px 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .splash-subtitle {
          font-size: 18px;
          color: #718096;
          margin: 0;
          font-weight: 500;
        }

        .splash-loading {
          text-align: center;
          margin-bottom: 40px;
        }

        .loading-spinner {
          position: relative;
          width: 60px;
          height: 60px;
          margin: 0 auto 20px;
        }

        .spinner-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 3px solid transparent;
          border-top: 3px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .spinner-ring:nth-child(2) {
          width: 80%;
          height: 80%;
          top: 10%;
          left: 10%;
          border-top-color: #764ba2;
          animation-delay: -0.3s;
        }

        .spinner-ring:nth-child(3) {
          width: 60%;
          height: 60%;
          top: 20%;
          left: 20%;
          border-top-color: #667eea;
          animation-delay: -0.6s;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-text {
          font-size: 16px;
          color: #718096;
          margin: 0;
          font-weight: 500;
        }

        .splash-progress {
          width: 100%;
          margin-bottom: 60px;
        }

        .progress-bar {
          width: 100%;
          height: 6px;
          background: #e2e8f0;
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 12px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        .progress-text {
          text-align: center;
          font-size: 14px;
          color: #718096;
          margin: 0;
          font-weight: 600;
        }

        .splash-features {
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: 100%;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: rgba(102, 126, 234, 0.05);
          border-radius: 12px;
          border: 1px solid rgba(102, 126, 234, 0.1);
        }

        .feature-icon {
          font-size: 20px;
          width: 24px;
          text-align: center;
        }

        .feature-text {
          font-size: 14px;
          color: #2d3748;
          font-weight: 500;
        }

        /* Mobile responsive adjustments */
        @media (max-width: 480px) {
          .splash-wrapper {
            width: 100%;
            height: 100vh;
            border-radius: 0;
            box-shadow: none;
          }
          
          .splash-content {
            padding: 20px;
          }
          
          .splash-title {
            font-size: 32px;
          }
          
          .splash-subtitle {
            font-size: 16px;
          }
        }

        /* Tablet responsive adjustments */
        @media (min-width: 481px) and (max-width: 768px) {
          .splash-wrapper {
            width: 480px;
            height: 800px;
          }
        }

        /* Desktop responsive adjustments */
        @media (min-width: 769px) {
          .splash-wrapper {
            width: 414px;
            height: 896px;
          }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen; 