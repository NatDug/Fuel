import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import FuelOrderPage from "./pages/FuelOrderPage";
import WalletPage from "./pages/WalletPage";
import TrackOrderPage from "./pages/TrackOrderPage";

const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/order" element={<FuelOrderPage />} />
      <Route path="/wallet" element={<WalletPage />} />
      <Route path="/track" element={<TrackOrderPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </Router>
);

export default App;