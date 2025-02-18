
import React, { Fragment } from "react";
import { Tab } from "@headlessui/react";
import { ExclamationTriangleIcon, CodeBracketIcon } from "@heroicons/react/24/outline";
import {Warning} from "postcss";

export default function BookingTypeSwitch({setDevBooking}: {setDevBooking: (devBooking: boolean) => void}) {
    
    return (
        <div className="booking-type flex flex-col">
            <Tab.Group>
                <Tab.List className={`flex justify-center sm:justify-normal`}>
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                className={`${
                                    selected ? 'bg-primary/90 text-white' : 'bg-white border border-tertiary text-black/75'
                                } py-1 px-2 rounded-r-none rounded-l-lg text-sm outline-none items-center w-28`}
                                onClick={() => setDevBooking(false)}
                            >
                                Play
                            </button>
                        )}
                    </Tab>
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button disabled={false}
                                className={`${
                                    selected ? 'bg-primary/90 text-white' : 'bg-white border border-tertiary text-black/75 text'
                                } py-1 px-2 rounded-l-none rounded-r-lg text-sm outline-none items-center w-28`}
                                onClick={() => setDevBooking(true)}
                            >
                                Development
                            </button>
                        )}
                    </Tab>
                </Tab.List>
            </Tab.Group>
            {/*<div>*/}
            {/*  <ExclamationTriangleIcon className="h-4 w-4 inline-block mr-1" />*/}
            {/*  <span className="text-sm text-black/70">Closed for recess. Lab visits by appointment only.</span>*/}
            {/*</div>*/}
        </div>
    )
}