import React from "react";
import "../styles/main-menu.css";

interface MainMenuProps {
  onNavigate: (route: string) => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onNavigate }) => {
  return (
    <div className="main-menu-container">
      <div className="main-menu-wrapper">
        <div className="main-menu-background"></div>
        <div className="main-menu-content">
          <div className="menu-header">
            <h1 className="menu-title">WeFuel</h1>
            <p className="menu-subtitle">Your Fuel Delivery Partner</p>
          </div>
          
          <div className="menu-options">
            <button 
              className="menu-option"
              onClick={() => onNavigate('/fuel-order')}
            >
              Order Fuel
            </button>
            <button 
              className="menu-option"
              onClick={() => onNavigate('/track-order')}
            >
              Track Order
            </button>
            <button 
              className="menu-option"
              onClick={() => onNavigate('/wallet')}
            >
              Wallet
            </button>
            <button 
              className="menu-option"
              onClick={() => onNavigate('/profile')}
            >
              Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainMenu; 