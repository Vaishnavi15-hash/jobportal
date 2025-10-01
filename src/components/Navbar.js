// src/components/Navbar.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import AppRegistrationOutlinedIcon from "@mui/icons-material/AppRegistrationOutlined";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import "../styles.css";

function Navbar({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token"); // Also remove token
    navigate("/login");
    window.location.reload();
  };

  console.log("Navbar user:", user); // 🔍 debug

  return (
    <nav className="navbar">
      {/* Left side */}
      <div className="nav-left">
        <Link to="/" className="profile-box">
          <WorkOutlineOutlinedIcon />
          <span>Jobs</span>
        </Link>
      </div>

      {/* Right side */}
      <div className="nav-right">
        {/* Not logged in → show Login & Register */}
        {!user && (
          <>
            <Link to="/login" className="profile-box">
              <LoginOutlinedIcon />
              <span>Login</span>
            </Link>
            <Link to="/register" className="profile-box">
              <AppRegistrationOutlinedIcon />
              <span>Register</span>
            </Link>
          </>
        )}

        {/* Logged in */}
        {user && (
          <>
            {user?.role?.toLowerCase() === "jobseeker" && (
              <>
                <Link to="/dashboard" className="profile-box">
                  <DashboardOutlinedIcon />
                  <span>Dashboard</span>
                </Link>
                <Link to="/profile" className="profile-box">
                  <AccountCircleOutlinedIcon />
                  <span>Profile</span>
                </Link>
                <Link to="/applications" className="profile-box">
                  <WorkOutlineOutlinedIcon />
                  <span>My Applications</span>
                </Link>
              </>
            )}

            {user?.role?.toLowerCase() === "employer" && (
              <>
                <Link to="/dashboard" className="profile-box">
                  <DashboardOutlinedIcon />
                  <span>Dashboard</span>
                </Link>
                <Link to="/post-job" className="profile-box">
                  <WorkOutlineOutlinedIcon />
                  <span>Post Job</span>
                </Link>
                <Link to="/profile" className="profile-box">
                  <AccountCircleOutlinedIcon />
                  <span>Profile</span>
                </Link>
              </>
            )}

            {/* Fallback: if user.role is missing/unknown, still show Profile */}
            {!["jobseeker", "employer"].includes(user?.role?.toLowerCase()) && (
              <Link to="/profile" className="profile-box">
                <AccountCircleOutlinedIcon />
                <span>Profile</span>
              </Link>
            )}

            {/* Logout always shown if logged in */}
            <button onClick={handleLogout} className="logout">
              <ExitToAppOutlinedIcon />
              <span>Logout</span>
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;