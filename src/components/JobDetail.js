import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";

const JobDetail = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [coverLetter, setCoverLetter] = useState("");

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await API.get(`jobs/${id}/`);
                setJob(response.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchJob();
    }, [id]);

    const handleApply = async () => {
        try {
            await API.post("applications/", {
                job: job.id,
                resume: "", // optionally you can extend to upload file later
                cover_letter: coverLetter,
            });
            alert("Applied successfully!");
            setCoverLetter("");
        } catch (err) {
            console.error(err);
            alert("Failed to apply");
        }
    };

    if (!job) return <p>Loading job...</p>;

    return (
        <div>
            <h2>{job.title}</h2>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Type:</strong> {job.job_type}</p>
            <p><strong>Description:</strong> {job.description}</p>
            <p><strong>Requirements:</strong> {job.requirements}</p>
            <p><strong>Deadline:</strong> {job.application_deadline}</p>

            <div>
                <h3>Apply for this job</h3>
                <textarea
                    placeholder="Cover Letter"
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                />
                <button onClick={handleApply}>Apply</button>
            </div>
        </div>
    );
};

export default JobDetail;
