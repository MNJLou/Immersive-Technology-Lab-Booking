import React from "react";
import { AdminLoginFormProps } from "../../../libs/interfaces";

export default function AdminLoginForm({ username, setAdminPrompt }: AdminLoginFormProps) {
    const [password, setPassword] = React.useState<string>("");
    const [error, setError] = React.useState<string>("");
    
    // Log the admin into the admin page
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        
        e.preventDefault();
        // For testing
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_URL as string + "/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            if (response.ok) {
                window.location.href = "/admin";
            } else {
                setError(data.message);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }
    
    // Login as a student
    const handleSkip = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_URL as string + "/api/users/" + username, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username })
        });
        if (response.ok) {
            window.location.href = "/";
        }
    }
    return (
        <div className="container admin-login">
            <form onSubmit={handleSubmit}>
                <h1 className="text-2xl font-bold">Welcome, {username}</h1>
                <p className="text-lg"><span className="font-bold">Admin login</span>. please enter your password to continue</p>
                <div className="error-container">
                    {error && <div className="input-error">{error}</div>}
                </div>
                <div className="spacer mt-16"></div>
                <div className="input-group mt-5">
                    <label htmlFor="password">Admin Password</label>
                    <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="button-group mt-5 flex justify-between">
                    <button type="button" className="secondary-button" onClick={() => setAdminPrompt(false)}>Cancel</button>
                    <div className="flex gap-5">
                        <button type="submit" className="">Login</button>
                        <button onClick={handleSkip} type="button" className="secondary-button">Skip</button>
                    </div>
                </div>
            </form>
            <div className="spacer mt-24"></div>

        </div>
    )
}