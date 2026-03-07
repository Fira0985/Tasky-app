const API_URL_VERCEL = process.env.REACT_APP_API_URL_vercel;
const API_URL_LOCAL = process.env.REACT_APP_API_URL || "http://localhost:4000";

// Fallback logic: Use Vercel URL if available, otherwise local
const getBaseUrl = () => {
    let url = API_URL_VERCEL || API_URL_LOCAL;

    // Normalize trailing slashes
    if (url.endsWith("/")) {
        url = url.slice(0, -1);
    }
    return url;
};

export const API_BASE_URL = getBaseUrl();

/**
 * Common fetch wrapper for API calls
 * @param {string} endpoint - API endpoint (e.g., '/login')
 * @param {object} options - Fetch options
 * @returns {Promise<object>} - Result object { ok, data, message, error, status }
 */
export const fetchAPI = async (endpoint, options = {}) => {
    const formattedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const url = `${API_BASE_URL}${formattedEndpoint}`;

    const defaultHeaders = {
        "Content-Type": "application/json",
    };

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        return {
            ok: response.ok,
            status: response.status,
            data: data,
            message: data.message || (response.ok ? "Success" : "Error"),
            error: data.error
        };
    } catch (error) {
        console.error(`API Request to ${endpoint} failed:`, error);
        return {
            ok: false,
            message: "Network error. Please ensure the backend is reachable.",
            error: error.message
        };
    }
};
