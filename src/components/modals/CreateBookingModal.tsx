import { CreateBookingModelProps } from "../../../libs/interfaces";
import React, {useState} from "react";
import { makeBooking } from "@/utils/bookingsHelper";
import Loader from "@/components/Loader"
import { ClipboardIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import { MAX_DEV_BOOKINGS, MAX_PLAY_BOOKINGS } from "../../../libs/data";

export default function CreateBookingModal({ setRefresh, setIsOpen, bookings, podPreference, devBooking, selectedDate, leftBookings }: CreateBookingModelProps) {

    const [loading, setLoading] = useState(false);

    const handleCreateBooking = async () => {
        setLoading(true);
        await makeBooking(bookings, podPreference, devBooking, selectedDate, leftBookings).then(() => {
        }).catch((error) => {
            console.error('Error:', error);
        });
        setLoading(false);
        setRefresh(true);
        setIsOpen(false);
    }

    return (
        <div className="fixed z-20 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog"
             aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-40 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div
                    className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                    role="dialog" aria-modal="true" aria-labelledby="modal-title">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mt-3  sm:mt-0 sm:ml-4 ">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 sm:flex sm:items-start sm:text-left text-center" id="modal-title">
                                    Create Booking
                                </h3>
                                <div className="lab-rules mt-2">
                                    <div className="flex mt-2 mb-2 sm:mb-3 sm:mt-3">
                                        <ClipboardIcon className="h-6 w-6 text-primary mr-1"/>
                                        <h4>Please take note of the <span className="text-primary font-bold">lab rules</span>:</h4>
                                    </div>
                                    <p className="text-sm text-secondary/60">
                                        Lab operating hours: Monday - Friday
                                    </p>
                                    <p className="text-sm text-secondary/70 mb-2">
                                         09:00 <span className="text-secondary/60">-</span> 12:00 <span className="text-secondary/60">and</span> 13:00 <span className="text-secondary/60">-</span> 14:00.
                                    </p>
                                    <ul className="list-inside text-sm text-black/80 list-decimal">
                                        <li>First-come-first-served.</li>
                                        <li>You are only allowed {devBooking ? MAX_PLAY_BOOKINGS : MAX_PLAY_BOOKINGS} bookings per week.</li>
                                        <li>Cancel well in advance to give other students a chance.</li>
                                        <li>Use the equipment with care.</li>
                                        <li>Drinks are allowed in the lab, but no food.</li>
                                    </ul>
                                    <div className="flex mt-2 mb-2 sm:mb-3 sm:mt-3">
                                        <EnvelopeIcon className="h-6 w-6 text-primary mr-1"/>
                                        <h5>A confirmation email will be sent. Please check your spam inbox as well.</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button onClick={() => handleCreateBooking()} type="button"
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm">
                            <div className="relative">
                                <div
                                    className={`${!loading ? 'hidden' : ''} absolute inset-0 flex items-center justify-center`}>
                                    <Loader size={25} color="white"/>
                                </div>
                                <div className={!loading ? 'visible' : 'invisible'}>Confirm Booking</div>
                            </div>
                        </button>
                        <button disabled={loading} onClick={() => setIsOpen(false)} type="button"
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:w-auto sm:text-sm">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}