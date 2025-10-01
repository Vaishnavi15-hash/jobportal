// src/components/Logout.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("user");
    navigate("/login");
  }, [navigate]);

  return null; // no UI
}

export default Logout;
