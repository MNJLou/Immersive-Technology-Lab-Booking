'use client'

import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';
import AdminLoginForm from '@/components/admin/AdminLoginForm';
import { useState } from 'react';

export default function Login() {

    const [studentNumber, setStudentNumber] = useState<string>("");
    // const [studentNumber, setStudentNumber] = useState<string>("u21533572") // set to a student number for testing
    const [unregistered, setUnregistered] = useState<boolean>(false);
    const [adminPrompt, setAdminPrompt] = useState<boolean>(false);
    // const [adminPrompt, setAdminPrompt] = useState<boolean>(true); // set to true for testing
    const [loading, setLoading] = useState<boolean>(false);

    return (
        // make width not full on wide screens
        <main className="grid grid-cols-1 place-items-center h-screen md:w-1/2 mx-auto">
            {/* // if unregistered is false then show the login form otherwise show the RegisterForm */}
            {/* <LoginForm studentNumber={studentNumber} setStudentNumber={setStudentNumber} /> */}
            { !unregistered ? 
                !adminPrompt ? 
                    <LoginForm studentNumber={studentNumber} setStudentNumber={setStudentNumber} unregistered={unregistered} setUnregistered={setUnregistered} setAdminPrompt={setAdminPrompt} loading={loading} setLoading={setLoading} />
                    :
                    <AdminLoginForm username={studentNumber} setAdminPrompt={setAdminPrompt} />
                : 
                <RegisterForm studentNumber={studentNumber} setUnregistered={setUnregistered} loading={loading} setLoading={setLoading} />
            }
            
        </main>
    )
}