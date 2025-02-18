import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import {dateNameMonthDay, getFirstTimeUsers} from "@/utils/adminHelper";
import Loader from "@/components/Loader";
import AdminBookingCard from "@/components/admin/AdminBookingCard";
import React, {useEffect, useState} from "react";
import { booking } from "../../../libs/interfaces";

export default function AdminBookings({bookings, loading, date, handleDateChange}: {bookings: booking[], loading: boolean, date: Date, handleDateChange: (next: boolean) => void}) {
  
  const [firstTimeUsers, setFirstTimeUsers] = useState([] as string[]);

  useEffect(() => {
    if(!loading) getFirstTimeUsers(bookings).then((data) => setFirstTimeUsers(data));
  }, [loading]);
  
  return (
    <div className="booking-list flex flex-col items-center mt-4 sm:mt-8 lg:mt-16 w-full">
      <div className="date w-full sm:w-1/2">
        <h3 className="text-center text-xl font-bold text-primary py-2 rounded-lg flex items-center justify-between sm:mx-0 px-2">
          <ChevronLeftIcon className="h-8 w-8 cursor-pointer hover:bg-tertiary/80 rounded-full transition-all duration-300" onClick={() => handleDateChange(false)}/>
          <div>{dateNameMonthDay(date)}</div>
          <ChevronRightIcon className="h-8 w-8 cursor-pointer hover:bg-tertiary/80 rounded-full transition-all duration-300" onClick={() => handleDateChange(true)}/>
        </h3>
      </div>
      {/*<div className="horizontal-line w-full my-2 border border-primary"></div>*/}
      <div className="flex flex-col w-full mb-2 px-4 mt-4 sm:px-0 sm:w-1/2">
        {loading ?
          <div className="flex justify-center w-full mt-24">
            <Loader size={50} color={"#005baa"}/>
          </div>
          : bookings.length ? bookings.map((booking: booking, index: number) => (
            <AdminBookingCard booking={booking} firstTimeUsers={firstTimeUsers} first={index === 0} key={index}/>
          )) : <div className="w-full text-center text-black/50 text-xl mt-24">No bookings</div>}
      </div>
    </div>
  )
} 