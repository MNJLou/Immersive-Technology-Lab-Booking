import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { DatePickerProps, dateAndDisabled } from "../../libs/interfaces";
import { format, addMonths } from "date-fns";
import { disabledDates } from "../../libs/data";
import {fetchBookingDates} from "@/utils/bookingsHelper";

export const DatePicker = ({selectedDate, setSelectedDate, devBooking, refresh}: DatePickerProps) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [dates, setDates] = useState<dateAndDisabled[]>([]);
    const [bookingDates, setBookingDates] = useState<string[]>([]);
    const [latestAvailableDate, setLatestAvailableDate] = useState<Date>(selectedDate);
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 56);
    
    useLayoutEffect(() => {
        const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
        const days = [] as dateAndDisabled[];
        const today = new Date();
        for (let i = firstDay; i <= lastDay; i.setDate(i.getDate() + 1)) {
            if(i.getDay() === 6 || i.getDay() === 0 || (i < startDate && i.toDateString() !== startDate.toDateString()) || disabledDates.includes(format(i, "yyyy-MM-dd"))) {
                days.push({date: new Date(i), disabled: true, today: i.toDateString() === today.toDateString()});
            } else {
                days.push({date: new Date(i), disabled: false, today: i.toDateString() === today.toDateString()});
            }
        }
        
        
        if (days.some(day => format(day.date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd") && day.disabled)) {
            let tempSelectedDate = days.find(day => !day.disabled)!.date;
            setLatestAvailableDate(tempSelectedDate);
            setSelectedDate(tempSelectedDate);
        }
        
        fetchBookingDates(devBooking, latestAvailableDate).then((dates) => {
            setBookingDates(dates);
        });
        
        setDates(days);
    } , [currentMonth]);
    const nextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, +1));
    }
    
    const prevMonth = () => {
        setCurrentMonth(addMonths(currentMonth, -1));
    }
    
    useEffect(() => {
        if (refresh) {
            fetchBookingDates(devBooking, latestAvailableDate).then((dates) => {
                if(dates.length > 0) {
                    setBookingDates(dates);
                }
            });
        }
    } , [refresh]);

    
    useEffect(() => {
        const selectedDateButton = document.querySelector(".selected") as HTMLElement;
        if (selectedDateButton) {
            selectedDateButton.scrollIntoView({behavior: "smooth", block: "center" });
        } else {
            const firstVisibleDate = document.querySelector(".date-button:not(.disabled)") as HTMLElement;
            if (firstVisibleDate) {
                firstVisibleDate.scrollIntoView({behavior: "smooth", block: "center"});
            }
        }
    } , [dates]);
    
    return (
        <div className="picker picker-container">
            <div className="header flex items-center ">
                <button className="button" disabled={currentMonth <= startDate}>
                    <ChevronLeftIcon className={"h-8 w-8 text-black/75" + (currentMonth <= startDate ? " disabled" : "")} onClick={prevMonth}/>
                </button>
                <button className="button" disabled={currentMonth >= endDate}>
                    <ChevronRightIcon className={"h-8 w-8 text-black/75" + (currentMonth >= endDate ? " disabled" : "")} onClick={nextMonth}/>
                </button>
                <div className="month ps-2">{format(currentMonth, "MMMM yyyy")}</div>
            </div>
            <div className="date-row flex overflow-x-auto scroll-smooth">
                {dates.map((date, index) => (
                    <button key={index} 
                            className={"date-button" + (date.disabled ? " disabled" : "") + (format(date.date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd") ? " selected" : "") + (date.today ? " today" : "") + " relative"}
                            disabled={date.disabled} 
                            onClick={() => setSelectedDate(date.date)}
                    >
                        <div className="booking-dot bg-secondary rounded-full absolute transform -translate-x-1/2 -translate-y-1/2 w-2 h-2"
                             style={{display: bookingDates.includes(format(date.date, "yyyy-MM-dd")) ? "block" : "none"}}></div>
                        <div className="day">{format(date.date, "EEE")}</div>
                        <div className="date">{format(date.date, "dd")}</div>
                    </button>
                ))}
                
            </div>
        </div>
    );
}