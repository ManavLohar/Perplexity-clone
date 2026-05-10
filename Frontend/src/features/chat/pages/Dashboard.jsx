import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { initializeSocketConnection } = useChat();

  useEffect(() => {
    initializeSocketConnection();
  }, []);

  return <div>Dashboard</div>;
};

export default Dashboard;
