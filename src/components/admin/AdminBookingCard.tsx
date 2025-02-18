import React from 'react';
import { booking } from '../../../libs/interfaces';
import { FaceSmileIcon, CodeBracketIcon } from "@heroicons/react/24/outline";
export default function AdminBookingCard({ booking, firstTimeUsers, first }: { booking: booking, firstTimeUsers: string[], first: boolean }) {
  
    return (
        <div className={`${booking.devBooking ? '' : ''} booking flex flex-col w-full rounded shadow-none lg:shadow-sm mt-1 p-2 bg-white sm:px-2 border border-tertiary`}>
            <div className="booking-details flex justify-between">
                {/*<div className="spacer h-6 w-6"></div>*/}
              <div className="flex items-center">
                <h3 className="text-xl font-bold">
                  {booking.studentNumber}
                </h3>
                <span>{firstTimeUsers.includes(booking.studentNumber) ?
                  <span className="border border-primary text-primary px-2 rounded ms-2 text-sm">New</span> : ""}
                </span>
              </div>
              <span>{booking.devBooking ?
                <div className="flex">{booking.podPreference === 0 ? "No Preference" : "Pod " + booking.podPreference}<span className="w-2"></span><span className="text-secondary">Dev</span></div> : <span className="text-primary">Play</span> }</span>
            </div>
            <div className="booking-details flex justify-between">
                <p className="">{booking.name} {booking.surname}</p>
                <p className="">{booking.time} - {booking.devBooking ? (parseInt(booking.time.split(":")[0]) + 1) + ":00" : (parseInt(booking.time.split(":")[1]) === 30 ? (parseInt(booking.time.split(":")[0]) + 1) + ":00" : (parseInt(booking.time.split(":")[0])) + ":30")}</p>
            </div>
        </div>
    )
}