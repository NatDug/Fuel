import React from "react";
import { useNavigate } from "react-router-dom";
import MainMenu from "../components/MainMenu";

const MainMenuPage: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigate = (route: string) => {
    navigate(route);
  };

  return <MainMenu onNavigate={handleNavigate} />;
};

export default MainMenuPage; 