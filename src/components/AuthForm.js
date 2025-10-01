import React, { useState } from "react";
import API from "../api";

const AuthForm = ({ type, onAuthSuccess }) => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("jobseeker");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let response;
            
            if (type === "register") {
                response = await API.post("users/register/", { 
                    username, 
                    email, 
                    password, 
                    role 
                });
                
                console.log("Registration successful:", response.data);
                
                // For registration, just save user data (no token yet)
                localStorage.setItem("user", JSON.stringify(response.data));
                onAuthSuccess(response.data);
                
            } else {
                // Login
                response = await API.post("users/login/", { 
                    email, 
                    password 
                });
                
                console.log("Login response:", response.data);
                
                // Check if response has token (new format) or just user data (old format)
                if (response.data.token) {
                    // New token-based response format
                    console.log("Token received:", response.data.token.substring(0, 10) + "...");
                    
                    // Save both token and user data
                    localStorage.setItem("token", response.data.token);
                    localStorage.setItem("user", JSON.stringify(response.data.user));
                    
                    // Pass user data to parent component
                    onAuthSuccess(response.data.user);
                } else {
                    // Old format (fallback) - just user data
                    console.log("No token in response, using session auth");
                    localStorage.setItem("user", JSON.stringify(response.data));
                    onAuthSuccess(response.data);
                }
            }
            
            // Clear form
            setEmail("");
            setUsername("");
            setPassword("");
            setRole("jobseeker");
            
        } catch (err) {
            console.error("Authentication error:", err);
            console.error("Error response:", err.response?.data);
            
            // Show specific error message if available
            const errorMessage = err.response?.data?.error || 
                               err.response?.data?.message || 
                               "Authentication failed";
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>{type === "register" ? "Create Account" : "Login"}</h2>
            
            <form onSubmit={handleSubmit}>
                {type === "register" && (
                    <>
                        <input 
                            type="text" 
                            placeholder="Username" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            required 
                        />
                        
                        <select 
                            value={role} 
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="jobseeker">Job Seeker</option>
                            <option value="employer">Employer</option>
                        </select>
                    </>
                )}
                
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
                
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                
                <button type="submit" disabled={loading}>
                    {loading ? "Please wait..." : (type === "register" ? "Register" : "Login")}
                </button>
            </form>
            
            {/* Debug info (remove in production) */}
            <div>
                <p><strong>Debug:</strong></p>
                <p>Token in storage: {localStorage.getItem('token') ? '✓ Yes' : '✗ No'}</p>
                <p>User in storage: {localStorage.getItem('user') ? '✓ Yes' : '✗ No'}</p>
            </div>
        </div>
    );
};

export default AuthForm;