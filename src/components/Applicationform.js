import React, { useState } from "react";
import "../styles.css";
import API from "../api";


const ApplicationForm = ({ job, onClose, onSuccess }) => {
  const [resume, setResume] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await API.post("applications/", {
        job: job.id,
        resume: resume,
        cover_letter: coverLetter,
      });

      console.log("Application submitted:", response.data);
      alert("Application submitted successfully!");
      
      if (onSuccess) onSuccess();
      if (onClose) onClose();
      
      // Reset form
      setResume("");
      setCoverLetter("");
      
    } catch (err) {
      console.error("Failed to submit application:", err);
      console.error("Error details:", err.response?.data);
      
      const errorMsg = err.response?.data?.detail || 
                      err.response?.data?.error || 
                      "Failed to submit application. Please try again.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Apply for {job.title}</h2>
        <p><strong>Location:</strong> {job.location}</p>
        <p><strong>Type:</strong> {job.job_type}</p>
        
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="resume">Resume / CV *</label>
            <textarea
              id="resume"
              placeholder="Paste your resume or CV here, or provide a link to your resume..."
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              required
              rows="8"
            />
          </div>

          <div>
            <label htmlFor="coverLetter">Cover Letter *</label>
            <textarea
              id="coverLetter"
              placeholder="Write a cover letter explaining why you're a good fit for this position..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              required
              rows="8"
            />
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Application"}
            </button>
            <button type="button" onClick={onClose} disabled={loading}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;