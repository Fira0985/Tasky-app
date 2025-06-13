async function registerRequest(event) {
    event.preventDefault();
    setSuccess(false);  // reset before request
    
    const url = api_url_vercel + "signup";
    const option = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };

    try {
        const response = await fetch(url, option);
        const result = await response.json();

        if (response.ok) {  // HTTP 200-299
            setMessage(result.message);
            setSuccess(true);
        } else {
            // Handles 409 and other errors from backend
            setMessage(result.message || "Registration failed");
            setSuccess(false);
        }

        if (props.GetMessage && typeof props.GetMessage === "function") {
            props.GetMessage(result.message);
        }
    } catch (error) {
        console.error("There was an error during the request:", error.message);
        setMessage("Network error or server is unreachable.");
        setSuccess(false);
        if (props.GetMessage && typeof props.GetMessage === "function") {
            props.GetMessage("Network error or server is unreachable.");
        }
    }
}
