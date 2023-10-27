import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Button, Text } from "@chakra-ui/react";
import Scanner from "../components/scanner/Scanner";
import Qr from "../components/qr/Qr";
import { useAuth } from "../context/GlobalProvider";

const Dashboard = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (!userInfo) {
      navigate("/");
    }
    console.log(auth);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  return (
    <>
      <Button onClick={handleLogout}>Logout</Button>
      <Button ms="10px" onClick={() => navigate("/events")}>
        Events
      </Button>
      <div className="grid">
        {auth?.user?.role === "admin" || auth?.user?.role === "faculty" ? (
          <>
            <Box>
              <Text>Admin Panel</Text>
              <Scanner />
            </Box>
          </>
        ) : (
          ""
        )}
        <Qr />
      </div>
    </>
  );
};

export default Dashboard;
