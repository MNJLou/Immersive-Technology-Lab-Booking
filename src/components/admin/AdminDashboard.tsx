"use client"

import React, {useState, useEffect} from 'react';
import Header from "../Header";
import { fetchAdminFromSession, fetchBookingsToday, dateNameMonthDay } from "@/utils/adminHelper";
import { disabledDates, disabledDayTimes } from "../../../libs/data";
import {format} from "date-fns";
import AdminNavigation from "@/components/admin/AdminNavigation";
import AdminBookings from "@/components/admin/AdminBookings";
import Loader from "@/components/Loader";
import {KeyIcon, WrenchScrewdriverIcon} from "@heroicons/react/16/solid";
import AdminAnalytics from "@/components/admin/AdminAnalytics";
import { booking } from "../../../libs/interfaces";

export default function AdminDashboard() {

  const [username, setUsername] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    setLoading(true);
    fetchAdminFromSession().then((data) => {
      setUsername(data.username);
    });
    while (date.getDay() === 0 || date.getDay() === 6 || disabledDates.includes(format(date, "yyyy-MM-dd"))) {
      date.setDate(date.getDate() + 1);
    }
    fetchBookingsToday(date).then((data) => {
      setBookings(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchBookingsToday(date).then((data) => {
      setBookings(data);
      setLoading(false);
    });
  } , [date]);

  const handleDateChange = (next: boolean) => {
    let newDate = new Date(next ? date.setDate(date.getDate() + 1) : date.setDate(date.getDate() - 1));
    while (newDate.getDay() === 0 || newDate.getDay() === 6 || disabledDates.includes(format(newDate, "yyyy-MM-dd"))) {
      newDate = new Date(next ? newDate.setDate(newDate.getDate() + 1) : newDate.setDate(newDate.getDate() - 1));

    }
    setDate(newDate);
  }
  
  const Page = ({bookings, loading, date, pageIndex}: {bookings: booking[], loading: boolean, date: Date, pageIndex: number}) => {
    return (
        pageIndex === 0 ? <AdminBookings bookings={bookings} loading={loading} date={date} handleDateChange={handleDateChange}/> :
        pageIndex === 1 ? <div className="flex flex-col items-center mt-80"><WrenchScrewdriverIcon className="h-24 w-24 text-black/50"/>Page in development</div> :
          pageIndex === 2 ? <AdminAnalytics/> :
            pageIndex === 3 ? <div className="flex flex-col items-center mt-80"><WrenchScrewdriverIcon className="h-24 w-24 text-black/50"/>Page in development</div> : null
    )
  }

  return (
    <div className="admin-dashboard grid lg:grid-cols-12 w-full lg:relative">
      <div className="lg:col-start-2 lg:col-span-10 lg:absolute top-5 -right-20">
        <Header studentNumber={username} setLoadingPage={setLoading}/>
      </div>
      <div className="header w-full lg:col-span-3 xl:col-span-2">
        <div className="flex sm:flex-row justify-center pt-2 items-center">
          <KeyIcon className="me-4 h-5 w-5 text-primary"/>
          <h2 className="ps-2 text-xl font-main lg:ps-0 order-2 sm:order-none mt-2 sm:mt-0 flex justify-center sm:flex-none">Admin Dashboard</h2>
        </div>
        
        <div className="adminNav w-full flex justify-center pt-5 border-b-primary border-b-2">
          <AdminNavigation pageIndex={pageIndex} setPageIndex={setPageIndex} />
        </div>
      </div>
      <div className="page w-full lg:col-span-9 xl:col-span-10">
        <Page bookings={bookings} loading={loading} pageIndex={pageIndex} date={date}/>
      </div>
  </div>
  )
}