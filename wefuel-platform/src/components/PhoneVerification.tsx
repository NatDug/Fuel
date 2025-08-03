import React, { useState, useRef, useEffect } from "react";

interface PhoneVerificationProps {
  onVerificationComplete: (phoneNumber: string) => void;
  onBack: () => void;
}

const PhoneVerification: React.FC<PhoneVerificationProps> = ({
  onVerificationComplete,
  onBack
}) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const codeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCodeSent && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, isCodeSent]);

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, "");
    
    // Format as (XXX) XXX-XXXX
    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 6) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    } else {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
    setError("");
  };

  const handleSendCode = async () => {
    if (phoneNumber.replace(/\D/g, "").length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    setIsVerifying(true);
    setError("");

    // Simulate API call
    setTimeout(() => {
      setIsCodeSent(true);
      setIsVerifying(false);
      setCountdown(30); // 30 second countdown
      if (codeInputRef.current) {
        codeInputRef.current.focus();
      }
    }, 1000);
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      setError("Please enter the 6-digit verification code");
      return;
    }

    setIsVerifying(true);
    setError("");

    // Simulate API call
    setTimeout(() => {
      setIsVerifying(false);
      onVerificationComplete(phoneNumber);
    }, 1000);
  };

  const handleResendCode = () => {
    if (countdown === 0) {
      handleSendCode();
    }
  };

  return (
    <div className="phone-verification-container">
      <div className="phone-verification-wrapper">
        <div className="phone-verification-background">
          {/* Background image applied via CSS */}
        </div>
        
        <div className="phone-verification-content">
          {/* Header */}
          <div className="verification-header">
            <button 
              className="back-button" 
              onClick={onBack}
              type="button"
            >
              ← Back
            </button>
            <h1 className="verification-title">
              {isCodeSent ? "Verify Phone" : "Enter Phone Number"}
            </h1>
            <p className="verification-subtitle">
              {isCodeSent 
                ? "We've sent a verification code to your phone"
                : "We'll send you a verification code"
              }
            </p>
          </div>
          
          {/* Form */}
          <div className="verification-form">
            {error && (
              <div className="verification-error">
                {error}
              </div>
            )}
            
            {!isCodeSent ? (
              // Phone Number Input
              <div className="phone-input-section">
                <div className="form-group">
                  <label htmlFor="phone" className="form-label">
                    Phone Number
                  </label>
                  <div className="phone-input-wrapper">
                    <span className="country-code">+1</span>
                    <input
                      ref={phoneInputRef}
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      className="phone-input"
                      placeholder="(555) 123-4567"
                      maxLength={14}
                    />
                  </div>
                  <p className="input-hint">
                    We'll send a verification code to this number
                  </p>
                </div>
                
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={isVerifying || phoneNumber.replace(/\D/g, "").length !== 10}
                  className="verification-button"
                >
                  {isVerifying ? "Sending..." : "Send Verification Code"}
                </button>
              </div>
            ) : (
              // Verification Code Input
              <div className="code-input-section">
                <div className="form-group">
                  <label htmlFor="code" className="form-label">
                    Verification Code
                  </label>
                  <input
                    ref={codeInputRef}
                    id="code"
                    name="code"
                    type="text"
                    required
                    value={verificationCode}
                    onChange={(e) => {
                      setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                      setError("");
                    }}
                    className="code-input"
                    placeholder="123456"
                    maxLength={6}
                  />
                  <p className="input-hint">
                    Enter the 6-digit code sent to {phoneNumber}
                  </p>
                </div>
                
                <button
                  type="button"
                  onClick={handleVerifyCode}
                  disabled={isVerifying || verificationCode.length !== 6}
                  className="verification-button"
                >
                  {isVerifying ? "Verifying..." : "Verify Code"}
                </button>
                
                <div className="resend-section">
                  <p className="resend-text">
                    Didn't receive the code?
                  </p>
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={countdown > 0}
                    className="resend-button"
                  >
                    {countdown > 0 
                      ? `Resend in ${countdown}s` 
                      : "Resend Code"
                    }
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="verification-footer">
            <p className="footer-text">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .phone-verification-container {
          position: relative;
          width: 100%;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .phone-verification-wrapper {
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

        .phone-verification-background {
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0px;
          top: 0px;
          background: url('data:image/svg+xml,<svg width="414" height="896" viewBox="0 0 414 896" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%23667eea;stop-opacity:0.1" /><stop offset="100%" style="stop-color:%23764ba2;stop-opacity:0.1" /></linearGradient><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="%23667eea" stroke-width="1" opacity="0.1"/></pattern></defs><rect width="100%" height="100%" fill="url(%23bgGradient)"/><rect width="100%" height="100%" fill="url(%23grid)"/><circle cx="100" cy="150" r="60" fill="%23667eea" opacity="0.05"/><circle cx="350" cy="300" r="80" fill="%23764ba2" opacity="0.05"/><circle cx="80" cy="600" r="40" fill="%23667eea" opacity="0.05"/><circle cx="320" cy="700" r="70" fill="%23764ba2" opacity="0.05"/><g transform="translate(200, 400)" opacity="0.1"><rect x="-15" y="-30" width="30" height="60" rx="5" fill="%23667eea"/><rect x="-10" y="-25" width="20" height="50" rx="3" fill="white"/><circle cx="0" cy="-10" r="8" fill="%23667eea"/><rect x="-5" y="10" width="10" height="15" fill="%23667eea"/></g></svg>') center/cover;
          opacity: 0.3;
          z-index: 1;
        }

        .phone-verification-content {
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 40px 30px;
          background: rgba(255, 255, 255, 0.95);
        }

        .verification-header {
          margin-bottom: 40px;
        }

        .back-button {
          background: none;
          border: none;
          color: #667eea;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .back-button:hover {
          color: #5a67d8;
        }

        .verification-title {
          font-size: 28px;
          font-weight: 700;
          color: #1a202c;
          margin: 0 0 8px 0;
        }

        .verification-subtitle {
          font-size: 16px;
          color: #718096;
          margin: 0;
        }

        .verification-form {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .verification-error {
          background: #fed7d7;
          border: 1px solid #feb2b2;
          color: #c53030;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 14px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          font-size: 14px;
          font-weight: 600;
          color: #2d3748;
        }

        .phone-input-wrapper {
          display: flex;
          align-items: center;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          background: white;
          overflow: hidden;
        }

        .country-code {
          padding: 16px 12px;
          background: #f7fafc;
          color: #4a5568;
          font-weight: 600;
          border-right: 1px solid #e2e8f0;
        }

        .phone-input {
          flex: 1;
          padding: 16px;
          border: none;
          font-size: 16px;
          outline: none;
          background: transparent;
        }

        .phone-input:focus {
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .code-input {
          padding: 16px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 18px;
          text-align: center;
          letter-spacing: 4px;
          transition: all 0.2s;
          background: white;
        }

        .code-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .input-hint {
          font-size: 12px;
          color: #718096;
          margin: 0;
        }

        .verification-button {
          margin-top: 20px;
          padding: 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .verification-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
        }

        .verification-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .resend-section {
          text-align: center;
          margin-top: 20px;
        }

        .resend-text {
          font-size: 14px;
          color: #718096;
          margin: 0 0 8px 0;
        }

        .resend-button {
          background: none;
          border: none;
          color: #667eea;
          font-weight: 600;
          cursor: pointer;
          text-decoration: underline;
          padding: 0;
          font-size: 14px;
        }

        .resend-button:hover:not(:disabled) {
          color: #5a67d8;
        }

        .resend-button:disabled {
          color: #a0aec0;
          cursor: not-allowed;
          text-decoration: none;
        }

        .verification-footer {
          text-align: center;
          margin-top: 30px;
        }

        .footer-text {
          font-size: 12px;
          color: #a0aec0;
          margin: 0;
          line-height: 1.4;
        }

        /* Mobile responsive adjustments */
        @media (max-width: 480px) {
          .phone-verification-wrapper {
            width: 100%;
            height: 100vh;
            border-radius: 0;
            box-shadow: none;
          }
          
          .phone-verification-content {
            padding: 20px;
          }
          
          .verification-title {
            font-size: 24px;
          }
          
          .verification-subtitle {
            font-size: 14px;
          }
        }

        /* Tablet responsive adjustments */
        @media (min-width: 481px) and (max-width: 768px) {
          .phone-verification-wrapper {
            width: 480px;
            height: 800px;
          }
        }

        /* Desktop responsive adjustments */
        @media (min-width: 769px) {
          .phone-verification-wrapper {
            width: 414px;
            height: 896px;
          }
        }
      `}</style>
    </div>
  );
};

export default PhoneVerification; 