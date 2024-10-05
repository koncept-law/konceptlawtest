import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userList, setUserList] = useState([]);

  const navigate = useNavigate();

  const setUserHandler = (data) => {
    setUser(data);
  };

  const getUserListHandler = async () => {
    try {
      const response = await fetch("https://t.kcptl.in/api/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("konceptLawToken")}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response?.status === 200) {
        const data = await response.json();
        setUserList(data?.foundUser);
      }
    } catch (error) {
      if (error.response?.status === 403) {
        localStorage.clear();
        navigate("/login");
      } else if (error.response?.data) {
        toastify({ msg: error.response.data, type: "error" });
      } else {
        toastify({ msg: error.message, type: "error" });
      }
    }
  };

  useEffect(() => {
    getUserListHandler();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUserHandler, userList }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
