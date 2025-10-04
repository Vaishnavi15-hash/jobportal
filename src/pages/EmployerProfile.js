import React, { useState, useEffect } from "react";
import API from "../api";

const EmployerProfile = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
    const [editing, setEditing] = useState(false);
    
    // Profile fields
    const [companyName, setCompanyName] = useState("");
    const [industry, setIndustry] = useState("");
    const [companySize, setCompanySize] = useState("");
    const [website, setWebsite] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [about, setAbout] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await API.get(`users/profile/`);
            const profile = response.data;
            
            setCompanyName(profile.company_name || "");
            setIndustry(profile.industry || "");
            setCompanySize(profile.company_size || "");
            setWebsite(profile.website || "");
            setPhone(profile.phone || "");
            setAddress(profile.address || "");
            setAbout(profile.about || "");
        } catch (err) {
            console.error("Failed to fetch profile:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await API.put(`users/profile/`, {
                company_name: companyName,
                industry: industry,
                company_size: companySize,
                website: website,
                phone: phone,
                address: address,
                about: about,
            });

            setUser(response.data);
            localStorage.setItem("user", JSON.stringify(response.data));
            alert("Profile updated successfully!");
            setEditing(false);
        } catch (err) {
            console.error("Failed to update profile:", err);
            alert("Failed to update profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <p>Please log in to view profile.</p>;

    return (
        <div className="employer-profile">
            <h2>Employer Profile</h2>
            
            <div className="profile-section">
                <h3>Account Information</h3>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
            </div>

            {!editing ? (
                <div className="profile-section">
                    <h3>Company Information</h3>
                    <button onClick={() => setEditing(true)}>Edit Profile</button>
                    
                    {companyName && <p><strong>Company Name:</strong> {companyName}</p>}
                    {industry && <p><strong>Industry:</strong> {industry}</p>}
                    {companySize && <p><strong>Company Size:</strong> {companySize}</p>}
                    {website && <p><strong>Website:</strong> <a href={website} target="_blank" rel="noopener noreferrer">{website}</a></p>}
                    {phone && <p><strong>Phone:</strong> {phone}</p>}
                    {address && <p><strong>Address:</strong> {address}</p>}
                    {about && (
                        <div>
                            <strong>About Company:</strong>
                            <p>{about}</p>
                        </div>
                    )}
                    
                    {!companyName && !industry && <p>No company information added yet. Click "Edit Profile" to add details.</p>}
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="profile-form">
                    <h3>Edit Company Information</h3>
                    
                    <div>
                        <label htmlFor="companyName">Company Name</label>
                        <input
                            id="companyName"
                            type="text"
                            placeholder="Your Company Name"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="industry">Industry</label>
                        <select
                            id="industry"
                            value={industry}
                            onChange={(e) => setIndustry(e.target.value)}
                        >
                            <option value="">Select Industry</option>
                            <option value="Technology">Technology</option>
                            <option value="Healthcare">Healthcare</option>
                            <option value="Finance">Finance</option>
                            <option value="Education">Education</option>
                            <option value="Manufacturing">Manufacturing</option>
                            <option value="Retail">Retail</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="companySize">Company Size</label>
                        <select
                            id="companySize"
                            value={companySize}
                            onChange={(e) => setCompanySize(e.target.value)}
                        >
                            <option value="">Select Size</option>
                            <option value="1-10">1-10 employees</option>
                            <option value="11-50">11-50 employees</option>
                            <option value="51-200">51-200 employees</option>
                            <option value="201-500">201-500 employees</option>
                            <option value="501+">501+ employees</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="website">Website</label>
                        <input
                            id="website"
                            type="url"
                            placeholder="https://yourcompany.com"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="phone">Phone</label>
                        <input
                            id="phone"
                            type="tel"
                            placeholder="Contact number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="address">Address</label>
                        <input
                            id="address"
                            type="text"
                            placeholder="Company address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="about">About Company</label>
                        <textarea
                            id="about"
                            placeholder="Tell us about your company..."
                            value={about}
                            onChange={(e) => setAbout(e.target.value)}
                            rows="4"
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                        <button type="button" onClick={() => setEditing(false)}>
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default EmployerProfile;