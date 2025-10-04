import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import AuthForm from "./components/AuthForm";
import JobForm from "./components/JobForm";
import JobDetail from "./components/JobDetail";
import ApplicationList from "./components/ApplicationList";
import JobSeekerProfile from "./pages/JobSeekerProfile";
import EmployerProfile from "./pages/EmployerProfile";
import PrivateRoute from "./components/PrivateRoute";


function App() {
    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <Router>
            <Navbar user={user} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<AuthForm type="login"   onAuthSuccess={(userData) => {
        localStorage.setItem("user", JSON.stringify(userData));
        window.location.href = "/dashboard"; // redirect after login
      }} />} />
                <Route path="/register" element={<AuthForm type="register" onAuthSuccess={(userData) => {
                    localStorage.setItem("user", JSON.stringify(userData));
                    window.location.href = "/dashboard"; // redirect after registration
                }} />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route
  path="/post-job"
  element={
    <PrivateRoute>
      <JobForm />
    </PrivateRoute>
  }
/>
                <Route path="/jobs/:id" element={<JobDetail />} />
                <Route path="/applications" element={<ApplicationList />} />
                <Route path="/profile" element={user?.role === "employer" ? <EmployerProfile /> : <JobSeekerProfile />} />
            </Routes>
        </Router>
    );
}

export default App;
