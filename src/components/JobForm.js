import React, { useState, useEffect } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

const JobForm = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [requirements, setRequirements] = useState("");
    const [location, setLocation] = useState("");
    const [jobType, setJobType] = useState("full-time");
    const [deadline, setDeadline] = useState("");
    const [loading, setLoading] = useState(false);

    // Get CSRF token when component mounts
    useEffect(() => {
        const getCSRFToken = async () => {
            try {
                await API.get('csrf/');
                console.log('CSRF token obtained successfully');
            } catch (error) {
                console.log('Error getting CSRF token:', error);
                // If csrf endpoint doesn't exist, try a simple GET request to set cookies
                try {
                    await API.get('jobs/');
                    console.log('Fallback: Got cookies from jobs endpoint');
                } catch (fallbackError) {
                    console.log('Fallback failed too:', fallbackError);
                }
            }
        };
        getCSRFToken();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Debug: Check cookies and CSRF token
        console.log("=== CSRF DEBUG INFO ===");
        console.log("All cookies:", document.cookie);
        console.log("Available cookies:", document.cookie.split('; '));
        
        const csrfCookie = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
        console.log("CSRF cookie found:", csrfCookie);
        
        if (csrfCookie) {
            console.log("CSRF token value:", csrfCookie.split('=')[1]);
        } else {
            console.log("⚠️ NO CSRF TOKEN FOUND!");
        }

        const jobData = {
            title,
            description,
            requirements,
            location,
            job_type: jobType,
            application_deadline: deadline,
        };

        console.log("Job data being sent:", jobData);

        try {
            const response = await API.post("jobs/", jobData);
            console.log("✅ Job posted successfully:", response.data);
            alert("Job posted successfully!");
            
            // Reset form
            setTitle("");
            setDescription("");
            setRequirements("");
            setLocation("");
            setJobType("full-time");
            setDeadline("");
            
            navigate("/dashboard");
        } catch (err) {
            console.error("❌ Failed to post job:", err);
            console.error("Error response:", err.response?.data);
            console.error("Error status:", err.response?.status);
            console.error("Error headers:", err.response?.headers);
            
            if (err.response?.status === 403) {
                alert("Permission denied. Please make sure you're logged in and have permission to post jobs.");
            } else if (err.response?.data) {
                alert(`Failed to post job: ${JSON.stringify(err.response.data)}`);
            } else {
                alert("Failed to post job. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
            <h2>Post a New Job</h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <div>
                    <label htmlFor="title">Job Title *</label>
                    <input 
                        id="title"
                        type="text" 
                        placeholder="e.g. Senior Software Engineer" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required 
                        style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                    />
                </div>

                <div>
                    <label htmlFor="description">Job Description *</label>
                    <textarea 
                        id="description"
                        placeholder="Describe the role, responsibilities, and what you're looking for..." 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        required 
                        rows="6"
                        style={{ width: "100%", padding: "8px", marginTop: "5px", resize: "vertical" }}
                    />
                </div>

                <div>
                    <label htmlFor="requirements">Requirements *</label>
                    <textarea 
                        id="requirements"
                        placeholder="List the required skills, experience, education, etc..." 
                        value={requirements} 
                        onChange={(e) => setRequirements(e.target.value)} 
                        required 
                        rows="4"
                        style={{ width: "100%", padding: "8px", marginTop: "5px", resize: "vertical" }}
                    />
                </div>

                <div>
                    <label htmlFor="location">Location *</label>
                    <input 
                        id="location"
                        type="text" 
                        placeholder="e.g. New York, NY or Remote" 
                        value={location} 
                        onChange={(e) => setLocation(e.target.value)} 
                        required 
                        style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                    />
                </div>

                <div>
                    <label htmlFor="jobType">Job Type *</label>
                    <select 
                        id="jobType"
                        value={jobType} 
                        onChange={(e) => setJobType(e.target.value)}
                        style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                    >
                        <option value="full-time">Full-Time</option>
                        <option value="part-time">Part-Time</option>
                        <option value="internship">Internship</option>
                        <option value="contract">Contract</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="deadline">Application Deadline *</label>
                    <input 
                        id="deadline"
                        type="date" 
                        value={deadline} 
                        onChange={(e) => setDeadline(e.target.value)} 
                        required 
                        min={new Date().toISOString().split('T')[0]} // Prevent past dates
                        style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    style={{ 
                        padding: "12px 20px", 
                        backgroundColor: loading ? "#ccc" : "#007bff", 
                        color: "white", 
                        border: "none", 
                        borderRadius: "4px", 
                        cursor: loading ? "not-allowed" : "pointer",
                        fontSize: "16px",
                        marginTop: "10px"
                    }}
                >
                    {loading ? "Posting..." : "Post Job"}
                </button>
            </form>

            {/* Debug info (remove in production) */}
            <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#f8f9fa", border: "1px solid #dee2e6", borderRadius: "4px" }}>
                <h4>Debug Info (remove in production):</h4>
                <p><strong>Cookies:</strong> {document.cookie || "No cookies found"}</p>
                <p><strong>CSRF Token:</strong> {document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1] || "Not found"}</p>
            </div>
        </div>
    );
};

export default JobForm;