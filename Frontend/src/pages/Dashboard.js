import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@chakra-ui/react";
import Scanner from "../components/scanner/Scanner";
import Qr from "../components/qr/Qr";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    // setUser(userInfo);

    if (!userInfo) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  return (
    <>
      <Button onClick={handleLogout}>Logout</Button>
      <div className="grid">
        <Scanner />
        <Qr />
      </div>
    </>
  );
};

export default Dashboard;
