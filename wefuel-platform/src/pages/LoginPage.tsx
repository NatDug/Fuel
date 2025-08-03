import React, { useState } from "react";
import AuthForm from "../components/AuthForm";
import SplashScreen from "../components/SplashScreen";
import PhoneVerification from "../components/PhoneVerification";

type LoginStep = 'splash' | 'login' | 'phone-verification' | 'complete';

const LoginPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<LoginStep>('splash');
  const [userData, setUserData] = useState<{
    userId?: string;
    email?: string;
    phoneNumber?: string;
  }>({});

  const handleSplashComplete = () => {
    setCurrentStep('login');
  };

  const handleLoginSuccess = (user: { userId: string; email: string }) => {
    setUserData({ userId: user.userId, email: user.email });
    setCurrentStep('phone-verification');
  };

  const handlePhoneVerificationComplete = (phoneNumber: string) => {
    setUserData(prev => ({ ...prev, phoneNumber }));
    setCurrentStep('complete');
    
    // Redirect to main menu after successful verification
    setTimeout(() => {
      window.location.href = "/main-menu";
    }, 1500);
  };

  const handleBackToLogin = () => {
    setCurrentStep('login');
  };

  // Render the appropriate component based on current step
  switch (currentStep) {
    case 'splash':
      return <SplashScreen onComplete={handleSplashComplete} duration={3000} />;
    
    case 'login':
      return <AuthForm onSuccess={handleLoginSuccess} mode="login" />;
    
    case 'phone-verification':
      return (
        <PhoneVerification
          onVerificationComplete={handlePhoneVerificationComplete}
          onBack={handleBackToLogin}
        />
      );
    
    case 'complete':
      return (
        <div className="completion-container">
          <div className="completion-wrapper">
            <div className="completion-content">
              <div className="completion-icon">✅</div>
              <h1 className="completion-title">Welcome to WeFuel!</h1>
              <p className="completion-subtitle">
                Your account has been successfully verified.
              </p>
              <div className="completion-details">
                <p><strong>Email:</strong> {userData.email}</p>
                <p><strong>Phone:</strong> {userData.phoneNumber}</p>
              </div>
              <p className="completion-redirect">
                Redirecting to dashboard...
              </p>
            </div>
          </div>
          
          <style jsx>{`
            .completion-container {
              position: relative;
              width: 100%;
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }

            .completion-wrapper {
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

            .completion-content {
              position: relative;
              z-index: 2;
              height: 100%;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding: 40px 30px;
              background: rgba(255, 255, 255, 0.95);
              text-align: center;
            }

            .completion-icon {
              font-size: 80px;
              margin-bottom: 30px;
            }

            .completion-title {
              font-size: 28px;
              font-weight: 700;
              color: #1a202c;
              margin: 0 0 16px 0;
            }

            .completion-subtitle {
              font-size: 16px;
              color: #718096;
              margin: 0 0 30px 0;
            }

            .completion-details {
              background: #f7fafc;
              border-radius: 12px;
              padding: 20px;
              margin-bottom: 30px;
              width: 100%;
            }

            .completion-details p {
              margin: 8px 0;
              font-size: 14px;
              color: #4a5568;
            }

            .completion-redirect {
              font-size: 14px;
              color: #667eea;
              font-weight: 600;
            }

            /* Mobile responsive adjustments */
            @media (max-width: 480px) {
              .completion-wrapper {
                width: 100%;
                height: 100vh;
                border-radius: 0;
                box-shadow: none;
              }
              
              .completion-content {
                padding: 20px;
              }
              
              .completion-title {
                font-size: 24px;
              }
              
              .completion-subtitle {
                font-size: 14px;
              }
            }

            /* Tablet responsive adjustments */
            @media (min-width: 481px) and (max-width: 768px) {
              .completion-wrapper {
                width: 480px;
                height: 800px;
              }
            }

            /* Desktop responsive adjustments */
            @media (min-width: 769px) {
              .completion-wrapper {
                width: 414px;
                height: 896px;
              }
            }
          `}</style>
        </div>
      );
    
    default:
      return <AuthForm onSuccess={handleLoginSuccess} mode="login" />;
  }
};

export default LoginPage;