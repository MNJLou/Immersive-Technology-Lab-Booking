import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { RegisterFormProps } from "../../libs/interfaces";
import { validateName, validateEmail, validateDegree, formatDegree } from "@/utils/validation";
import Loader from "@/components/Loader";
export default function Register({ studentNumber, setUnregistered, loading, setLoading }: RegisterFormProps){
    
    const currentYear = new Date().getFullYear();
    const router: any = useRouter();

    const [name, setName] = useState<string>("");
    const [surname, setSurname] = useState<string>("");

    const [yearOfStudy, setYearOfStudy] = useState<number>(currentYear);
    const [email, setEmail] = useState<string>("");
    // const [degree, setDegree] = useState<comboboxItem>(degreePrograms[0]);
    const [degree, setDegree] = useState<string>("");
    
    const [nameError, setNameError] = useState<string>("");
    const [surnameError, setSurnameError] = useState<string>("");
    const [emailError, setEmailError] = useState<string>("");
    const [degreeError, setDegreeError] = useState<string>("");
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        if(validateForm()) {
            const formattedDegree = formatDegree(degree);
            try {
                const response = await fetch(process.env.NEXT_PUBLIC_URL as string + "/api/users/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ name, surname, email, degree: formattedDegree, yearOfStudy, studentNumber })
                });
                if (response.ok) {
                    const loginResponse = await fetch(process.env.NEXT_PUBLIC_URL as string + "/api/users/" + studentNumber, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ studentNumber })
                    });
                    if (loginResponse.ok) {
                        window.location.href = "/";
                        setLoading(false);
                        return;
                    }
                } else {
                    console.log("There was an error");
                    console.error("Error:", response.status, response.statusText);
                }
            } catch (error) {
                console.error("Error in registration:", error);
            }
        }
        setLoading(false);
    };
    const validateForm = () => {
        const nameError = validateName(name);
        const surnameError = validateName(surname);
        const emailError = validateEmail(email);
        const degreeError = validateDegree(degree);
        setNameError(nameError);
        setSurnameError(surnameError);
        setEmailError(emailError);
        setDegreeError(degreeError);
        
        if (nameError + surnameError + emailError + degreeError !== "") {
            console.log(nameError, surnameError, emailError, degreeError);
            return false;
        }
        return true;
    }
    
    return (
        <div className="container">
            <form onSubmit={handleSubmit} className="flex flex-col">
                <h1>Register</h1>
                <p>Create an account for {studentNumber}</p>
                <div className="spacer mt-6"></div>
                <div className="input-group">
                    <label htmlFor="name">Name<span className="error-label">{nameError}</span></label>
                    <input type="text" className={nameError ? "error" : ""} placeholder="" onChange={(e) => setName(e.target.value)} onBlur={(e) => setNameError(validateName(name))} disabled={loading}/>
                </div>
                <div className="input-group">
                    <label htmlFor="surname">Surname<span className="error-label">{surnameError}</span></label>
                    <input type="text" className={surnameError ? "error" : ""} placeholder="" onChange={(e) => setSurname(e.target.value)} onBlur={(e) => setSurnameError(validateName(surname))} disabled={loading}/>
                    
                </div>
                <div className="input-group">
                    <label htmlFor="degree">Degree Program<span className="error-label">{degreeError}</span></label>
                    {/*<ComboboxComponent items={degreePrograms} selectedItem={degree} setSelectedItem={setDegree} error={degreeError} setError={setDegreeError} />*/}
                    <input name="degree-program" id="degree-program" type="text" list="degree-programs" onChange={(e) => setDegree(e.target.value)} onBlur={(e) => setDegreeError(validateDegree(degree))} disabled={loading}/>
                </div>
                <div className="input-group">
                    <label htmlFor="year-of-study">Year of commencement of studies</label>
                    <input name="year-of-study" id="year-of-study" type="number" max={currentYear} min="1960" onChange={(e) => setYearOfStudy(parseInt(e.target.value))} value={yearOfStudy} disabled={loading}/>
                </div>
                <div className="input-group">
                    <label htmlFor="email">Email<span className="error-label">{emailError}</span></label>
                    <input type="email" className={emailError ? "error" : ""} placeholder="" onChange={(e) => setEmail(e.target.value)} onBlur={(e) => setEmailError(validateEmail(email))} disabled={loading}/>
                </div>
                <div className="button-group mt-5 flex justify-between">
                    <button type="button" className="secondary-button" onClick={() => setUnregistered(false)}>Cancel</button>
                    <button type="submit">
                        <div className="relative">
                            <div className={`${!loading ? 'hidden' : ''} absolute inset-0 flex items-center justify-center`}>
                                <Loader size={25} color="white" />
                            </div>
                            <div className={!loading ? 'visible' : 'invisible'}>Sign Up</div>
                        </div>
                    </button>
                </div>
            </form>
        </div>
    )
}