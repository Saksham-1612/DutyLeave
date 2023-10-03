"use client";
// import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

const GlobalContext = createContext();

// const router = useRouter();

const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState();

  useEffect(() => {
    // const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    // setUser(userInfo);
    // if (!userInfo) router.push("/auth");
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const GlobalState = () => {
  return useContext(GlobalContext);
};

export default GlobalProvider;
