import React, { useEffect, useState } from "react";
import API from "../api";
import ApplicationForm from "./Applicationform";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  // Get current user
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await API.get("jobs/");
        setJobs(response.data);
        setFilteredJobs(response.data);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      }
    };
    fetchJobs();
  }, []);

  // Filter jobs whenever search input changes
  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    const filtered = jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(lowerSearch) ||
        job.location.toLowerCase().includes(lowerSearch) ||
        job.job_type.toLowerCase().includes(lowerSearch)
    );
    setFilteredJobs(filtered);
  }, [search, jobs]);

  const handleApply = (jobId) => {
    const job = filteredJobs.find(j => j.id === jobId);
    setSelectedJob(job);
  };

  const handleCloseForm = () => {
    setSelectedJob(null);
  };

  const handleApplicationSuccess = () => {
    setSelectedJob(null);
  };

  return (
    <div>
      <h2>Available Jobs</h2>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search by title, location, or type"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredJobs.length === 0 ? (
        <p>No jobs found</p>
      ) : (
        <ul>
          {filteredJobs.map((job) => (
            <li key={job.id} className="job-item">
              <h3>{job.title}</h3>
              <p>{job.description}</p>
              <p><strong>Requirements:</strong> {job.requirements}</p>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Type:</strong> {job.job_type}</p>
              <p><strong>Deadline:</strong> {job.application_deadline}</p>
              
              {/* Show Apply button only for job seekers */}
              {user.role === 'jobseeker' && (
                <button
                  onClick={() => handleApply(job.id)}
                  className="apply-btn"
                >
                  Apply Now
                </button>
              )}
              
              {/* Show employer info for employers */}
              {user.role === 'employer' && (
                <p><strong>Posted by:</strong> {job.employer?.username || 'Unknown'}</p>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Application Form Modal */}
      {selectedJob && (
        <ApplicationForm
          job={selectedJob}
          onClose={handleCloseForm}
          onSuccess={handleApplicationSuccess}
        />
      )}
    </div>
  );
};

export default JobList;