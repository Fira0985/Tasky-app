import React, { useState } from "react";
import '../styles/pop.css';

function Pop(props) {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [success, setSuccess] = useState(false);
    const [message, setMessage] = useState("");

    const color = { color: "red" };
    const api_url_vercel = process.env.REACT_APP_API_URL_vercel;

    const data = {
        name,
        email,
        password
    };

    function GetMessage(data) {
        props.GetMessage(data);
    }

    function nameValue(event) {
        setName(event.target.value);
    }

    function passwordValue(event) {
        setPassword(event.target.value);
    }

    function emailValue(event) {
        setEmail(event.target.value);
    }

    async function registerRequest(event) {
        event.preventDefault();
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

            if (result.message === "User registered successfully") {
                setMessage(result.message);
                setSuccess(true);
            } else {
                setMessage(result.message);
                setSuccess(false);
            }

            GetMessage(result.message); // Send the result message to the parent
        } catch (error) {
            console.error("There was an error during the request:", error.message);
            setMessage("Something went wrong. Please try again.");
            setSuccess(false);
        }
    }

    return (
        <div id="register-box" style={props.style}>
            <h2>Register</h2>
            <form action="#" onSubmit={registerRequest}>
                <div className="textbox">
                    <input type="text" placeholder="Full Name" required onChange={nameValue} />
                </div>
                <div className="textbox">
                    <input type="email" placeholder="Email" required onChange={emailValue} />
                </div>
                <div className="textbox">
                    <input type="password" placeholder="Password" required onChange={passwordValue} />
                </div>

                {message && (
                    <div className="message">
                        <label htmlFor="message" style={color}>{message}</label>
                    </div>
                )}

                <button type="submit" className="btn">Register</button>
            </form>
        </div>
    );
}

export default Pop;
