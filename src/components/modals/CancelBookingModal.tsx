import React, { useState } from 'react';
import { CancelBookingModelProps, loaderProps } from "../../../libs/interfaces";
import { cancelBooking } from "@/utils/bookingsHelper";
import Loader from "@/components/Loader";
export default function CancelBookingModal( { setRefresh, setIsOpen, bookingIds }: CancelBookingModelProps ) {
    
    const [loading, setLoading] = useState(false);
    const handleCancelBooking = async () => {
        setLoading(true);
        await cancelBooking(bookingIds).then((response) => {
        });
        setLoading(false);
        setRefresh(true);
        setIsOpen(false);
    }
    
    return (
        <div className="fixed z-20 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-40 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-title">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                    Cancel Booking
                                </h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                        Are you sure you want to cancel this booking?
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button onClick={() => handleCancelBooking()} type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-secondary text-base font-medium text-white hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm">
                            <div className="relative">
                                <div className={`${!loading ? 'hidden' : ''} absolute inset-0 flex items-center justify-center`}>
                                    <Loader size={25} color="white" />
                                </div>
                                <div className={!loading ? 'visible' : 'invisible'}>Cancel Booking</div>
                            </div>
                        </button>
                        <button disabled={loading} onClick={() => setIsOpen(false)} type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:w-auto sm:text-sm">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}