import React, { useState, useEffect } from 'react';
import { toISOStringWithTimezone, listAvailableBookings, fetchWeeksBookings } from '@/utils/bookingsHelper';
import { booking, availableBooking, DatesProps } from '../../libs/interfaces';
import { DatePicker } from "@/components/DatePicker";
import Loader from "@/components/Loader";
import { MAX_DEV_BOOKINGS, MAX_PLAY_BOOKINGS} from "../../libs/data";
import { ClockIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";
import CancelBookingModal from "@/components/modals/CancelBookingModal";
import CreateBookingModel from "@/components/modals/CreateBookingModal";

export default function Dates( { devBooking, podPreference, setPodPreference, loadingPage, setLoadingPage }: DatesProps) {

  const [availableBookings, setAvailableBookings] = useState<availableBooking[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loadingBooking, setLoadingBooking] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [cancelBookingModal, setCancelBookingModal] = useState(false);
  const [createBookingModal, setCreateBookingModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [selectedBookings, setSelectedBookings] = useState<availableBooking[]>([]);
  const [weekBookings, setWeekBookings] = useState<availableBooking[][]>([]); // [devBookings, playBookings]

  useEffect(() => {
    fetchWeeksBookings().then((data) => {
      setWeekBookings(data);
    });
  }, []);

  useEffect(() => {
    setLoadingSlots(true);
    setSelectedBookings([])
    listEvents().then((data) => {
      setAvailableBookings(data);
      setLoadingSlots(false);
    });
  } , [selectedDate, devBooking, podPreference]);

  useEffect(() => {
    setLoadingSlots(true);
    if (refresh) {
      listEvents().then((data) => {
        setAvailableBookings(data);
        setLoadingSlots(false);
      });
      setRefresh(false);
    }

    fetchWeeksBookings().then((data) => {
      setWeekBookings(data);
    });

    setSelectedBookings([]);
  }, [refresh]);

  /**
   *
   */
  const listEvents = async () => {
    const response = await fetch(process.env.NEXT_PUBLIC_URL as string + "/api/bookings", {
      method: "POST",
      headers: {"Content-Type": "application/json",},
      body: JSON.stringify({ date: toISOStringWithTimezone(selectedDate).split("T")[0], devBooking: devBooking }),
    });
    const bookings: { id: string, studentNumber: string, startTime: string, devBooking: boolean, podPreference: number, }[] = [];
    const data = await response.json();
    data.bookings.forEach((booking: booking) => {
      const id = booking._id;
      const studentNumber = booking.studentNumber;
      const startTime = booking.time;
      const devBooking = booking.devBooking;
      const podPreference = booking.podPreference;
      bookings.push({ id, studentNumber, startTime, devBooking, podPreference });
    });
    const availableBookings = listAvailableBookings(bookings, devBooking, data.studentNumber, podPreference, selectedDate);
    loadingPage && setLoadingPage(false);
    return availableBookings;
  }

  const handleCancelModal = (ids: string[]) => {
    setSelectedIds(ids);
    setCancelBookingModal(true);
  }

  const checkIfHourBefore = (booking: availableBooking) => {
    if(!(new Date(selectedDate).toDateString() === (new Date().toDateString()))){
      return false;
    }

    const hour = parseInt(booking.start.split(":")[0]);
    const nextHourFromNow = new Date().getHours() + 1;

    if(devBooking){
      return nextHourFromNow >= hour;
    } else {
      const minute = parseInt(booking.start.split(":")[1]);
      const currentMinute = new Date().getMinutes();

      if(nextHourFromNow > hour || (nextHourFromNow === hour && (minute !== 30 || currentMinute >= 30))) {
        return true;
      }
      
      // Booking is not blocked
      return false;
    }
  }

  // Handle the selection of multiple booking slots
  const handleSelect = (booking: availableBooking) => {

    // Ensure that cancel and book buttons are not clicked at the same time
    if(booking.myBooking) {
      if(selectedBookings.length !== 0 && !selectedBookings[0].myBooking) {
        return;
      }
    } else {
      if(selectedBookings.length !== 0 && selectedBookings[0].myBooking) {
        return;
      }
    }

    if(selectedBookings.includes(booking)) {
      setSelectedBookings(selectedBookings.filter((selectedBooking) => selectedBooking !== booking));
    } else {
      if(booking.myBooking || selectedBookings.length < (devBooking ? MAX_DEV_BOOKINGS - weekBookings[0].length : MAX_PLAY_BOOKINGS - weekBookings[1].length)) {
        setSelectedBookings([...selectedBookings, booking]);
      }
    }
  }

  if (loadingPage) {
    return (
      <div className="loading-container flex justify-center items-center py-20">
        <Loader size={40} color={"#005baa"} />
      </div>
    );
  }

  return (
    <div className="booking-slots d-flex flex-column">
      {cancelBookingModal && <CancelBookingModal setRefresh={setRefresh} setIsOpen={setCancelBookingModal} bookingIds={selectedIds} />}
      {createBookingModal && <CreateBookingModel setRefresh={setRefresh} setIsOpen={setCreateBookingModal} bookings={selectedBookings} podPreference={podPreference} devBooking={devBooking} selectedDate={selectedDate} leftBookings={devBooking ? MAX_DEV_BOOKINGS - weekBookings[0].length : MAX_PLAY_BOOKINGS - weekBookings[1].length} />}
      <DatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} devBooking={devBooking} refresh={refresh} />
      <div className="slots-container flex justify-center bg-tertiary/60 shadow-none lg:shadow-sm mt-2 lg:mt-5">
        <div className="slots">
          <div className="bookings-left flex">
            <CalendarDaysIcon className="h-5 w-5 mr-2"/>
            <span className="text-sm">{devBooking ? (MAX_DEV_BOOKINGS - weekBookings[0]?.length - selectedBookings.filter((booking) => !booking.myBooking).length)
              : (MAX_PLAY_BOOKINGS - weekBookings[1]?.length - selectedBookings.filter((booking) => !booking.myBooking).length)} booking{devBooking ?
              (MAX_DEV_BOOKINGS - weekBookings[0]?.length) === 1 ? "" : "s" : (MAX_PLAY_BOOKINGS - weekBookings[1]?.length) === 1 ? "" : "s"} remaining this week</span>
          </div>
          <div className="time flex mt-2">
            <ClockIcon className="h-5 w-5 mr-2"/>
            <span className="text-sm">{devBooking ? "55 minutes" : "25 minutes"}</span>
          </div>
          <div className="booking-details">
            {devBooking &&
                <div className="pod-preference flex flex-col w-full sm:w-1/2 md:w-1/3 lg:w-1/4 mt-4">
                    <label htmlFor="pod-preference">Pod Preference</label>
                    <select id="pod-preference" value={podPreference} onChange={(e) => setPodPreference(parseInt(e.target.value))}>
                        <option value={0}>No Preference</option>
                        <option value={1}>Pod 1</option>
                        <option value={2}>Pod 2</option>
                        <option value={3}>Pod 3</option>
                    </select>
                </div>
            }
          </div>
          <div className="mt-2">
            <h3>Morning Slots</h3>
            <div className="morning-bookings">
              <div className="py-2">
                <div hidden={loadingSlots}>
                  {availableBookings.map((booking, index) => {
                    if (parseInt(booking.start.split(":")[0]) < 12) {
                      return (
                        <button
                          key={index}
                          disabled={!booking.myBooking && booking.booked || checkIfHourBefore(booking)}
                          onClick={() => handleSelect(booking)}
                          className={`${booking.myBooking ? "my-booking" : ""} ${selectedBookings.includes(booking) ? "selected" : ""} relative`}
                        >
                          {booking.start}
                          {(booking.myBooking) && <div className="booked-count absolute right-0 top-0 bg-secondary rounded-xl text-white text-xs px-1 py-0 items-center">{booking.myBooking}</div>}
                        </button>
                      );
                    }
                  })}
                </div>
                <div className="skeleton-loading" hidden={!loadingSlots}>
                  {devBooking ?
                    <div className="skeleton-loading">
                      <button className="skeleton-button motion-safe:animate-pulse" disabled={true}><span>9:00</span></button>
                      <button className="skeleton-button motion-safe:animate-pulse" disabled={true}><span>10:00</span></button>
                      <button className="skeleton-button motion-safe:animate-pulse" disabled={true}><span>11:00</span></button>
                    </div> :
                    <div className="skeleton-loading">
                      <button className="skeleton-button motion-safe:animate-pulse" disabled={true}><span>9:00</span></button>
                      <button className="skeleton-button motion-safe:animate-pulse" disabled={true}><span>9:30</span></button>
                      <button className="skeleton-button motion-safe:animate-pulse" disabled={true}><span>10:00</span></button>
                      <button className="skeleton-button motion-safe:animate-pulse" disabled={true}><span>10:30</span></button>
                      <button className="skeleton-button motion-safe:animate-pulse" disabled={true}><span>11:00</span></button>
                      <button className="skeleton-button motion-safe:animate-pulse" disabled={true}><span>11:30</span></button>
                    </div>
                  }
                </div>
              </div>
            </div>
            <h3>Afternoon Slots</h3>
            <div className="afternoon-bookings">
              <div>
                <div hidden={loadingSlots}>
                  {availableBookings.map((booking, index) => {
                    if (parseInt(booking.start.split(":")[0]) >= 12) {
                      return (
                        <button
                          key={index}
                          disabled={(!booking.myBooking && booking.booked) || checkIfHourBefore(booking)}
                          onClick={() => handleSelect(booking)}
                          className={`${booking.myBooking ? "my-booking" : ""} ${selectedBookings.includes(booking) ? "selected" : ""} relative`}
                        >
                          {booking.start}
                        </button>
                      );
                    }
                  })}
                </div>
                <div className="skeleton-loading" hidden={!loadingSlots}>
                  {devBooking ?
                    <div className="skeleton-loading">
                      <button className="skeleton-button motion-safe:animate-pulse" disabled={true}><span>13:00</span></button>
                    </div> :
                    <div className="skeleton-loading">
                      <button className="skeleton-button motion-safe:animate-pulse" disabled={true}><span>13:00</span></button>
                      <button className="skeleton-button motion-safe:animate-pulse" disabled={true}><span>13:30</span></button>
                    </div>
                  }
                </div>
              </div>
            </div>
            <div className={`${loadingBooking || selectedBookings.length > 0 ? "opacity-100" : "opacity-0" } 
                        booking-button flex justify-center lg:justify-end`}>
              {selectedBookings[0]?.myBooking ?
                <button type="button" className={`w-full sm:w-1/2 md:w-1/4 lg:w-1/6 bg-secondary`} disabled={selectedBookings.length === 0} onClick={() => handleCancelModal(selectedBookings?.map((booking) => booking.id))}>
                  Cancel
                </button>
                :
                <button type="button" className={`w-full sm:w-1/2 md:w-1/4 lg:w-1/6 bg-primary`} disabled={selectedBookings.length === 0} onClick={() => setCreateBookingModal(true)}>
                  Continue
                </button>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}