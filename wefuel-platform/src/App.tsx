import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SplashPage from "./pages/SplashPage";
import LoginPage from "./pages/LoginPage";
import MainMenuPage from "./pages/MainMenuPage";
import FuelOrderPage from "./pages/FuelOrderPage";
import WalletPage from "./pages/WalletPage";
import TrackOrderPage from "./pages/TrackOrderPage";
import DemoPage from "./pages/DemoPage";

// Driver Pages
import DriverTrainingPage from "./pages/DriverTrainingPage";
import DriverDeliveriesPage from "./pages/DriverDeliveriesPage";
import DriverEarningsPage from "./pages/DriverEarningsPage";
import DriverReferralsPage from "./pages/DriverReferralsPage";

// Station Pages
import StationDashboardPage from "./pages/StationDashboardPage";
import StationInventoryPage from "./pages/StationInventoryPage";
import StationOrdersPage from "./pages/StationOrdersPage";
import StationReportsPage from "./pages/StationReportsPage";

// Admin Pages
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminUserManagementPage from "./pages/AdminUserManagementPage";
import AdminSystemSettingsPage from "./pages/AdminSystemSettingsPage";

const App: React.FC = () => (
  <Router>
    <Routes>
      {/* Home Landing Page */}
      <Route path="/" element={<SplashPage />} />
      
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Main Menu Route */}
      <Route path="/main-menu" element={<MainMenuPage />} />
      
      {/* User Routes */}
      <Route path="/fuel-order" element={<FuelOrderPage />} />
      <Route path="/wallet" element={<WalletPage />} />
      <Route path="/track-order" element={<TrackOrderPage />} />
      
      {/* Driver Routes */}
      <Route path="/driver/training" element={<DriverTrainingPage />} />
      <Route path="/driver/deliveries" element={<DriverDeliveriesPage />} />
      <Route path="/driver/earnings" element={<DriverEarningsPage />} />
      <Route path="/driver/referrals" element={<DriverReferralsPage />} />
      
      {/* Station Routes */}
      <Route path="/station/dashboard" element={<StationDashboardPage />} />
      <Route path="/station/inventory" element={<StationInventoryPage />} />
      <Route path="/station/orders" element={<StationOrdersPage />} />
      <Route path="/station/reports" element={<StationReportsPage />} />
      
      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      <Route path="/admin/users" element={<AdminUserManagementPage />} />
      <Route path="/admin/settings" element={<AdminSystemSettingsPage />} />
      
      {/* Fallback redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Router>
);

export default App;