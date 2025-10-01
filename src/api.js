import axios from "axios";

// Create axios instance
const API = axios.create({
    baseURL: "http://localhost:8000/api/", // Django backend
    withCredentials: true, // still useful for session fallback
});

// Add token to requests if available
API.interceptors.request.use((config) => {
    // Try to get token from localStorage
    const token = localStorage.getItem('token');
    
    if (token) {
        config.headers['Authorization'] = `Token ${token}`;
        console.log('Adding token to request:', token.substring(0, 10) + '...');
    } else {
        console.log('No token found in localStorage');
    }

    // Still try CSRF for session auth fallback
    const csrftoken = getCookie("csrftoken");
    if (csrftoken && ["post", "put", "patch", "delete"].includes(config.method)) {
        config.headers["X-CSRFToken"] = csrftoken;
    }

    return config;
});

// Helper function to get CSRF token from cookies
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(name + "=")) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export default API;