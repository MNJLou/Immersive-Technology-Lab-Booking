import Dates from "@/components/Dates";
import React, {useState, useEffect} from 'react';
import { fetchUserFromSession } from "@/utils/bookingsHelper"
import { UserIcon } from "@heroicons/react/24/outline";
import BookingTypeSwitch from "@/components/BookingTypeSwitch";
import Header from "@/components/Header";
export default function BookingForm() {
    
    const [devBooking, setDevBooking] = useState(false);
    const [podPreference, setPodPreference] = useState(0);
    const [studentNumber, setStudentNumber] = useState("");
    const [loadingPage, setLoadingPage] = useState(true);
    
    useEffect(() => {
        fetchUserFromSession().then((data) => {
            setStudentNumber(data.studentNumber);
        });
    }, []);
    
    return (
        <div className="booking-form grid place-items-center w-full">
            <div className="header w-full flex flex-col sm:flex-row justify-between">
                <div className="booking-type-switch ps-2 lg:ps-0 order-2 sm:order-none mt-8 sm:mt-0 flex justify-center sm:flex-none items-center">
                    <BookingTypeSwitch setDevBooking={setDevBooking}/>
                </div>
                <Header studentNumber={studentNumber} setLoadingPage={setLoadingPage}/>
            </div>
            <div className="dates-container mt-8 sm:mt-16">
                <Dates devBooking={devBooking} podPreference={podPreference} setPodPreference={setPodPreference} loadingPage={loadingPage} setLoadingPage={setLoadingPage}/>
            </div>
        </div>
    );
}