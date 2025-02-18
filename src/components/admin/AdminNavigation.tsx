import React from "react";
import { ClockIcon, CalendarDaysIcon, ChartPieIcon, UserIcon} from "@heroicons/react/24/outline";


export default function AdminNavigation({pageIndex, setPageIndex} : {pageIndex: number, setPageIndex: React.Dispatch<React.SetStateAction<number>>}) {
  
  return (
    <div className="admin-nav flex justify-around w-full bg-white lg:flex lg:flex-col">
      <button className={`nav-button flex justify-center lg:justify-normal gap-2 w-full rounded-none text-primary ${pageIndex === 0 ? 'bg-primary hover:bg-primary text-white' : 'bg-white'}`}
              onClick={() => setPageIndex(0)}>
        <ClockIcon className="h-6 w-6 block"/>
        <span className="hidden sm:block lg:w-full">Bookings</span> 
      </button>
      <button className={`nav-button flex justify-center lg:justify-normal gap-2 w-full rounded-none text-primary ${pageIndex === 1 ? 'bg-primary hover:bg-primary text-white' : 'bg-white'}`}
              onClick={() => setPageIndex(1)}>
        <CalendarDaysIcon className="h-6 w-6 block"/>
        <span className="hidden sm:block lg:w-full">Calendar</span>
      </button>
      <button className={`nav-button flex justify-center lg:justify-normal gap-2 w-full rounded-none text-primary ${pageIndex === 2 ? 'bg-primary hover:bg-primary text-white' : 'bg-white'}`}
              onClick={() => setPageIndex(2)}>
        <ChartPieIcon className="h-6 w-6 block"/>
        <span className="hidden sm:block lg:w-full">Analytics</span>
      </button>
      <button className={`nav-button flex justify-center lg:justify-normal gap-2 w-full rounded-none text-primary ${pageIndex === 3 ? 'bg-primary hover:bg-primary text-white' : 'bg-white'}`}
              onClick={() => setPageIndex(3)}>
        <UserIcon className="h-6 w-6 block"/>
        <span className="hidden sm:block lg:w-full">User</span>
      </button>
    </div> 
  )
} 