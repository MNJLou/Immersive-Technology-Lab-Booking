import React, { useEffect } from "react";
import { LoginFormProps } from "../../libs/interfaces";
import { validateStudentNumber } from "@/utils/validation";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";

export default function LoginForm({ studentNumber, setStudentNumber, setUnregistered, setAdminPrompt, loading, setLoading }: LoginFormProps) {
    
    const [error, setError] = React.useState<string>("");
    const router = useRouter();
    
    useEffect(() => {
        setError("");
    }, [studentNumber]);
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setLoading(true);
        e.preventDefault();
        if(validateUser(studentNumber)) {
            try { // TODO: These two calls could probably be combined into one
                // Check if the user is an admin and redirect to the admin page rather than logging in
                const adminResponse = await fetch(process.env.NEXT_PUBLIC_URL as string + "/api/admin/" + studentNumber, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ studentNumber })
                });

                const isAdmin = await adminResponse.json();
                if (isAdmin) {
                    setAdminPrompt(true);
                    setLoading(false);
                    return;
                }
                
                const response = await fetch(process.env.NEXT_PUBLIC_URL as string + "/api/users/" + studentNumber, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ studentNumber })
                });
                if (response.status === 200) {
                    window.location.href = "/";
                    setLoading(false);
                    return;
                } else if (response.status === 404) {
                    setLoading(false);
                    setUnregistered(true);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        }
        setLoading(false);
    };
    
    const validateUser = (user: string) => {
        const studentNumberError = validateStudentNumber(user);
        if (studentNumberError) {
            setError(studentNumberError);
            return false;
        }
        return true;
    }
    
    const setStudentNumberLowercase = (studentNumber: string) => {
        setStudentNumber(studentNumber.toLowerCase());
    }
    
    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <h1 className="text-2xl font-bold">Login</h1>
                <p className="text-lg">Welcome to the Immersive Technology Lab</p>
                <div className="error-container">
                    {error && <div className="input-error">{error}</div>}
                </div>  
                <div className="spacer mt-16"></div>
                <div className="input-group mt-5">
                    <label htmlFor="student-number">Student Number</label>
                    
                    <input type="text" placeholder="e.g. u12345678" onChange={(e) => setStudentNumberLowercase(e.target.value)} disabled={loading} />
                </div>
                <div className="button-group mt-5 flex justify-end">
                    <button type="submit">
                        <div className="relative">
                            <div className={`${!loading ? 'hidden' : ''} absolute inset-0 flex items-center justify-center`}>
                                <Loader size={25} color="white" />
                            </div>
                            <div className={!loading ? 'visible' : 'invisible'}>Continue</div>
                        </div>
                    </button>
                </div>
            </form>
            <div className="spacer mt-24"></div>

        </div>
    )
}