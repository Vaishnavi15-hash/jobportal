import React, { useEffect, useState } from "react";
import API from "../api";

const ApplicationList = () => {
    const [applications, setApplications] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await API.get("applications/");
                setApplications(response.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchApplications();
    }, []);

    if (!user) return <p>Please log in to view applications.</p>;

    return (
        <div>
            <h2>{user.role === "employer" ? "Applications for Your Jobs" : "My Applications"}</h2>
            {applications.length === 0 ? (
                <p>No applications found.</p>
            ) : (
                <ul>
                    {applications.map((app) => (
                        <li key={app.id}>
                            {user.role === "employer" ? (
                                <>
                                    <h3>Applicant: {app.applicant?.username || 'Unknown'}</h3>
                                    <p><strong>Job:</strong> {app.job?.title || 'Unknown'}</p>
                                    <p><strong>Applied on:</strong> {new Date(app.applied_at).toLocaleDateString()}</p>
                                    <p><strong>Resume:</strong> {app.resume}</p>
                                    <p><strong>Cover Letter:</strong> {app.cover_letter}</p>
                                </>
                            ) : (
                                <>
                                    <h3>{app.job?.title || 'Unknown Job'}</h3>
                                    <p><strong>Location:</strong> {app.job?.location || 'N/A'}</p>
                                    <p><strong>Type:</strong> {app.job?.job_type || 'N/A'}</p>
                                    <p><strong>Applied on:</strong> {new Date(app.applied_at).toLocaleDateString()}</p>
                                    <p><strong>Status:</strong> {app.job?.is_active ? "Open" : "Closed"}</p>
                                    <p><strong>Your Resume:</strong> {app.resume}</p>
                                    <p><strong>Your Cover Letter:</strong> {app.cover_letter}</p>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ApplicationList;