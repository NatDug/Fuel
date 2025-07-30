import React from "react";
import AuthForm from "../components/AuthForm";

const LoginPage: React.FC = () => {
  const handleAuth = (data: any) => {
    // TODO: Call your API endpoint here (login or signup)
    console.log(data);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <AuthForm onSubmit={handleAuth} />
    </div>
  );
};

export default LoginPage;