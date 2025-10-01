import React from "react";

const JobSeekerProfile = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return <p>Please log in to view profile.</p>;

    return (
        <div>
            <h2>Job Seeker Profile</h2>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
        </div>
    );
};

export default JobSeekerProfile;
