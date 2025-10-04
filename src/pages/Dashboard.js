import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import "../styles.css";

const Dashboard = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const [jobs, setJobs] = useState([]);
    const [editingJob, setEditingJob] = useState(null);
    const [showEditForm, setShowEditForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Edit form fields
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [requirements, setRequirements] = useState("");
    const [location, setLocation] = useState("");
    const [jobType, setJobType] = useState("full-time");
    const [deadline, setDeadline] = useState("");

    useEffect(() => {
        if (user?.role === "employer") {
            fetchEmployerJobs();
        }
    }, []);

    
    const fetchEmployerJobs = async () => {
    try {
        setError("");
        const response = await API.get("jobs/");
        
        console.log("===== DEBUG INFO =====");
        console.log("All jobs from API:", response.data);
        console.log("Current user ID:", user.id);
        console.log("User object:", user);
        
        // Check each job's employer field
        response.data.forEach(job => {
            console.log(`Job "${job.title}" - employer:`, job.employer);
        });
        
        // Filter to show only this employer's jobs
        const myJobs = response.data.filter(job => {
            const userId = user.id;
            
            // Handle both flat ID and nested object
            if (job.employer && !job.employer.id) {
                return Number(job.employer) === userId;
            }
            
            if (job.employer?.id) {
                return Number(job.employer.id) === userId;
            }
            
            return false;
        });

        console.log("Filtered jobs (my jobs):", myJobs);
        console.log("My jobs count:", myJobs.length);
        console.log("======================");

        setJobs(myJobs);
    } catch (err) {
        console.error("Failed to fetch jobs:", err);
        setError("Failed to load jobs. Please refresh the page.");
    }
};
    
    const handleEdit = (job) => {
        setEditingJob(job);
        setTitle(job.title);
        setDescription(job.description);
        setRequirements(job.requirements);
        setLocation(job.location);
        setJobType(job.job_type);
        setDeadline(job.application_deadline);
        setShowEditForm(true);
        setError("");
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await API.put(`jobs/${editingJob.id}/`, {
                title,
                description,
                requirements,
                location,
                job_type: jobType,
                application_deadline: deadline,
            });

            // Update the job in state immediately without refetching
            setJobs(jobs.map(job => 
                job.id === editingJob.id ? response.data : job
            ));

            alert("Job updated successfully!");
            resetForm();
        } catch (err) {
            console.error("Failed to update job:", err);
            setError("Failed to update job. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (jobId) => {
        if (!window.confirm("Are you sure you want to delete this job posting? This action cannot be undone.")) {
            return;
        }

        try {
            await API.delete(`jobs/${jobId}/`);
            
            // Remove job from state immediately
            setJobs(jobs.filter(job => job.id !== jobId));
            
            alert("Job deleted successfully!");
        } catch (err) {
            console.error("Failed to delete job:", err);
            alert("Failed to delete job. Please try again.");
        }
    };

    const handleMarkAsFilled = async (jobId) => {
        try {
            const response = await API.patch(`jobs/${jobId}/`, {
                is_active: false
            });
            
            // Update state immediately
            setJobs(jobs.map(job => 
                job.id === jobId ? { ...job, is_active: false } : job
            ));
            
            alert("Job marked as filled!");
        } catch (err) {
            console.error("Failed to mark job as filled:", err);
            alert("Failed to update job status.");
        }
    };

    const handleReopen = async (jobId) => {
        try {
            const response = await API.patch(`jobs/${jobId}/`, {
                is_active: true
            });
            
            // Update state immediately
            setJobs(jobs.map(job => 
                job.id === jobId ? { ...job, is_active: true } : job
            ));
            
            alert("Job reopened!");
        } catch (err) {
            console.error("Failed to reopen job:", err);
            alert("Failed to update job status.");
        }
    };

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setRequirements("");
        setLocation("");
        setJobType("full-time");
        setDeadline("");
        setEditingJob(null);
        setShowEditForm(false);
        setError("");
    };

    if (!user) return <p>Please log in to access the dashboard.</p>;

    return (
        <div>
            <h2 className="oval-title">
                {user.role === "employer" ? "Employer Dashboard" : "Job Seeker Dashboard"}
            </h2>

            {user.role === "employer" ? (
                <div>
                    {/* Quick Actions */}
                    <div className="dashboard-actions">
                        <h1><Link className="oval-link" to="/post-job">Post a New Job</Link></h1>
                        <h1><Link className="oval-link" to="/applications">View Applications</Link></h1>
                    </div>

                    {/* Stats */}
                    <div className="dashboard-stats">
                        <div className="stat-item">
                            <strong>Total Jobs:</strong> {jobs.length}
                        </div>
                        <div className="stat-item">
                            <strong>Active Jobs:</strong> {jobs.filter(j => j.is_active).length}
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    {/* Edit Form Modal */}
                    {showEditForm && (
                        <div className="modal-overlay">
                            <div className="edit-job-section modal-content">
                                <h3>Edit Job Posting</h3>
                                <form onSubmit={handleUpdate}>
                                    <div>
                                        <label>Job Title *</label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label>Description *</label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            required
                                            rows="4"
                                        />
                                    </div>

                                    <div>
                                        <label>Requirements *</label>
                                        <textarea
                                            value={requirements}
                                            onChange={(e) => setRequirements(e.target.value)}
                                            required
                                            rows="4"
                                        />
                                    </div>

                                    <div>
                                        <label>Location *</label>
                                        <input
                                            type="text"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label>Job Type *</label>
                                        <select
                                            value={jobType}
                                            onChange={(e) => setJobType(e.target.value)}
                                        >
                                            <option value="full-time">Full-Time</option>
                                            <option value="part-time">Part-Time</option>
                                            <option value="internship">Internship</option>
                                            <option value="contract">Contract</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label>Application Deadline *</label>
                                        <input
                                            type="date"
                                            value={deadline}
                                            onChange={(e) => setDeadline(e.target.value)}
                                            required
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>

                                    <div className="form-actions">
                                        <button type="submit" disabled={loading}>
                                            {loading ? "Updating..." : "Update Job"}
                                        </button>
                                        <button type="button" onClick={resetForm} disabled={loading}>
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Job Listings */}
                    <div className="jobs-management">
                        <h3>Manage Your Job Postings</h3>
                        {jobs.length === 0 ? (
                            <p>You haven't posted any jobs yet.</p>
                        ) : (
                            <ul>
                                {jobs.map((job) => (
                                    <li key={job.id} className="job-card">
                                        <div className="job-header">
                                            <h4>{job.title}</h4>
                                            <span className={job.is_active ? 'status-active' : 'status-closed'}>
                                                {job.is_active ? 'Active' : 'Closed'}
                                            </span>
                                        </div>
                                        
                                        <p><strong>Location:</strong> {job.location}</p>
                                        <p><strong>Type:</strong> {job.job_type}</p>
                                        <p><strong>Deadline:</strong> {job.application_deadline}</p>
                                        
                                        <div className="job-actions">
                                            <button 
                                                onClick={() => handleEdit(job)}
                                                className="edit-btn"
                                            >
                                                ✏️ Edit
                                            </button>
                                            
                                            {job.is_active ? (
                                                <button 
                                                    onClick={() => handleMarkAsFilled(job.id)}
                                                    className="status-btn"
                                                >
                                                    ✓ Mark as Filled
                                                </button>
                                            ) : (
                                                <button 
                                                    onClick={() => handleReopen(job.id)}
                                                    className="status-btn"
                                                >
                                                    🔄 Reopen
                                                </button>
                                            )}
                                            
                                            <button 
                                                onClick={() => handleDelete(job.id)}
                                                className="delete-btn"
                                            >
                                                🗑️ Delete
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
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