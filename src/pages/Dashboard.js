import React from "react";
import { Link } from "react-router-dom";
import "../styles.css";

const Dashboard = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return <p>Please log in to access the dashboard.</p>;

    return (
        <div>
            <h2 className="oval-title">{user.role === "employer" ? "Employer Dashboard" : "Job Seeker Dashboard"}</h2>

            {user.role === "employer" ? (
                <div>
                    <h1><Link className="oval-link" to="/post-job">Post a New Job</Link></h1>
                    <h1><Link className="oval-link" to="/applications">View Applications</Link></h1>
                </div>
            ) : (
                <div>
                    <h1><Link className="oval-link" to="/applications">My Applications</Link></h1>

                    <h1><Link className="oval-link" to="/">Search Jobs</Link></h1>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
