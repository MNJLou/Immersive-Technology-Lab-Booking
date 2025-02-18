'use client'
import React, { useEffect, useState } from 'react';
import BookingForm from "@/components/BookingForm";
export default function Home() {
    
  return (
    <main className="grid place-items-center max-w-5xl mx-auto mt-2">
        <BookingForm/>
    </main>
  );
}
