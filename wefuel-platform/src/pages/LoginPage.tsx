import React from "react";
import AuthForm from "../components/AuthForm";

const LoginPage: React.FC = () => {
  const handleLoginSuccess = (user: { userId: string; email: string }) => {
    console.log("Login successful:", user);
    // Redirect to dashboard or home page
    window.location.href = "/";
  };

  return <AuthForm onSuccess={handleLoginSuccess} mode="login" />;
};

export default LoginPage;