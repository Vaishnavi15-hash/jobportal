import React from "react";
import JobList from "../components/JobList";
// Import your CSS file here if it's not globally available
import "../styles.css";

function Home() {
  // Get user from localStorage to check role
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  return (
    // 1. Apply the main background class to the outermost container
     
    <div className="homepage-background">
      
      {/* 2. A separate div for the content you want to display over the background */}
      <div className="hero-content">
        <img 
          src="https://plus.unsplash.com/premium_photo-1692241076210-9e696db67fce?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8am9icyUyMHZhY2FudCUyMGluJTIwc29mdHdhcmV8ZW58MHx8MHx8fDA%3D"
          alt="Illustration of recruitment and job opportunities"
          className="hero-image" // Add a class for styling
        />
        <h1>Find Your Future</h1> 
        <p>Explore jobs, apply, and manage your profile.</p>
        
        {/* You could add a search bar component here for immediate engagement */}
        
        {/* Show JobList for all users, or you can restrict to job seekers only */}
        {user.role === 'jobseeker' || user.role === 'employer' ? (
          <JobList />
        ) : (
          <p>Please log in to view available jobs.</p>
        )}
      </div>

    </div>
  );
}

export default Home;