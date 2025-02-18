import React from "react";

// === Login & Register ===
export interface LoginFormProps {
    studentNumber: string;
    setStudentNumber: React.Dispatch<React.SetStateAction<string>>;
    unregistered: boolean;
    setUnregistered: React.Dispatch<React.SetStateAction<boolean>>;
    setAdminPrompt: React.Dispatch<React.SetStateAction<boolean>>;
    loading : boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface RegisterFormProps {
    studentNumber: string;
    setUnregistered: React.Dispatch<React.SetStateAction<boolean>>;
    loading : boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface AdminLoginFormProps {
    username: string;
    setAdminPrompt: React.Dispatch<React.SetStateAction<boolean>>;
}

// === Bookings ===
export interface availableBooking {
    id: string;
    booked: boolean;
    myBooking: boolean;
    start: string;
    end: string;
}

export interface booking {
    _id: string;
    name: string;
    surname: string;
    studentNumber: string;
    date: string;
    time: string;
    devBooking: boolean;
    podPreference: number;
}

export interface DatesProps {
    devBooking: boolean;
    podPreference: number;
    setPodPreference: React.Dispatch<React.SetStateAction<number>>;
    
    loadingPage: boolean;
    
    setLoadingPage: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface DatePickerProps {
    selectedDate: Date;
    setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
    devBooking: boolean;
    refresh: boolean;
}

export interface dateAndDisabled {
    date: Date;
    disabled: boolean;
    today: boolean;
}

export interface CreateBookingModelProps {
    setRefresh : React.Dispatch<React.SetStateAction<boolean>>;
    setIsOpen : React.Dispatch<React.SetStateAction<boolean>>;
    bookings: { start: string, end: string }[] 
    podPreference: number 
    devBooking: boolean 
    selectedDate: Date
    leftBookings: number
}

export interface CancelBookingModelProps {
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    bookingIds: string[];
}

// === For Utilities ===
export interface comboboxItem {
    id: number;
    name: string;
}

export interface comboboxProps {
    items: comboboxItem[];
    selectedItem: comboboxItem;
    setSelectedItem: React.Dispatch<React.SetStateAction<comboboxItem>>;
    error?: string;
    setError?: React.Dispatch<React.SetStateAction<string>>;
}

export interface loaderProps {
    size: number;
    color: string;
}

export interface headerProps {
    studentNumber: string;
    setLoadingPage: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface logoutButtonProps {
    setLoadingPage: React.Dispatch<React.SetStateAction<boolean>>;
}

// === For Email ===
export interface emailEventProps {
        start: Date;
        summary: string; 
        description: string;
        url: string; 
}

export interface emailStudentProps {
    studentNumber: string;
    name: string;
    email: string;
}

export interface emailIcsProps {
    event: emailEventProps;
    student: emailStudentProps;
    devBooking: boolean;
}

export interface emailerProps {
    email: string;
    subject: string;
    textHtml: string;
    ids: string[];
    icsList: emailIcsProps[];
}

export interface emailerCancelProps {
    email: string;
    subject: string;
    textHtml: string;
    icsUids: string[];
    icsList: emailIcsProps[];
}