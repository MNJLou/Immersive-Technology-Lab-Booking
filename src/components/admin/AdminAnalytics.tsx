"use client"

import {useEffect, useState} from "react";
import { fetchAllBookings, fetchAllUsers } from "@/utils/bookingsHelper";
import Loader from "@/components/Loader";
import {booking} from "../../../libs/interfaces";

import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function AdminAnalytics() {
  
  const [users, setUsers] = useState([] as any[]);
  const [bookings, setBookings] = useState([] as booking[]);
  const [loading, setLoading] = useState(true);
  const [showWeek, setShowWeek] = useState(false);
  const [graphWidth, setGraphWidth] = useState(300);
  const [bookingsChartData, setBookingsChartData] = useState({
    options: {
      chart: {
        id: "not-set",
      },
      xaxis: {
        categories: {},
      },
      stroke: {
        width: 3,
      },
    },
    series: [
      {
        name: "series-1",
        data: [] as number[],
      },
    ],
  });
  const [degreeChartData, setDegreeChartData] = useState({
    series: [] as number[],
    options: {
      chart: {
        width: 380,
        id: "not-set",
      },
      labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
      dataLabels: {
        enabled: true,
        formatter: function (val: any) {
          return val.toFixed(2) + "%"
        },
      },
    }
  });
  const [monthsWithBookings, setMonthsWithBookings] = useState(0);
  const [bookingChart, setBookingChart] = useState(<Loader color={"#005baa"} size={50}/>);
  const [degreeChart, setDegreeChart] = useState(<Loader color={"#005baa"} size={50}/>);
  
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      await fetchAllUsers().then((data) => {
        setUsers(data);
      });
      await fetchAllBookings().then((data) => {
        // setbookings then console.log them in a callback
        setBookings(data);
        sortDegrees(users, data);
      });
    }
    fetchData();
    if(window.innerWidth >= 640) { // sm
      setGraphWidth(600);
    } else { // xs
      setGraphWidth(340);
    }
    

    

    
  }, []);
  
  useEffect(() => {
    if(bookingsChartData.options.chart.id === "booking") {
      setBookingChart(<Chart
        options={bookingsChartData.options}
        series={bookingsChartData.series}
        type="line"
        width={graphWidth}
        height={graphWidth / 1.75}
      />)
    }
  }, [bookingsChartData]);

  useEffect(() => {
    if(degreeChartData.options.chart.id === "pie") {
      setDegreeChart(<Chart
        options={degreeChartData.options}
        series={degreeChartData.series}
        type="pie"
        width={graphWidth}
        height={window.innerWidth > 480 ? graphWidth / 1.75 : 500}
      />)
    }
  }, [degreeChartData]);

  useEffect(() => {
    showMonths().then(() => {
      setLoading(false);
    });
  }, [bookings]);

  useEffect(() => {
    if(showWeek) {
      showWeeks();
    } else {
      showMonths();
    }
  }, [showWeek]);

  useEffect(() => {
    if(bookings.length === 0 || users.length === 0) return;
    sortDegrees(users, bookings);
  }, [bookings, users]);

  /**
   * Gets the bookings for every week in the given year
   * @param bookings
   */
  const getWeeksBookings = (bookings: booking[]) => {
    const currentYear = new Date().getFullYear();
    let weeks = new Array(52).fill(0);
    const firstMonday = new Date(currentYear, 0, 1 + (1 - new Date(currentYear, 0, 1).getDay()));
    bookings.forEach((booking) => {
      if (parseInt(booking.date.split("-")[0]) !== currentYear) return;
      let date = new Date(booking.date);
      let week = Math.ceil((((date.getTime() - firstMonday.getTime()) / 86400000) + firstMonday.getDay() + 1) / 7);
      weeks[week - 1]++;
    });
    return weeks as number[];
  }

  /**
   * Gets the bookings for every month in the given year
   * @param bookings
   */
  const getMonthsBookings = (bookings: booking[]) => {
    const currentYear = new Date().getFullYear();
    let months = new Array(12).fill(0);
    bookings.forEach((booking) => {
      if (parseInt(booking.date.split("-")[0]) !== currentYear) return;
      let monthString = parseInt(booking.date.split("-")[1].slice(0, 2));
      months[monthString - 1]++;
    });
    return months as number[];
  }

  /**
   * Sets the chart data to show the bookings for every month
   */
  const showMonths = async () => {
    let data = getMonthsBookings(bookings);
    setMonthsWithBookings(data.filter((month) => month > 0).length);
    setBookingsChartData((bookingsChartData) => ({
      ...bookingsChartData,
      options: {
        ...bookingsChartData.options,
        chart: {
          id:"booking"
        },
        xaxis: {
          categories: new Array(12).fill(0).map((_, i) => i + 1),
        },
        colors: ["#005baa"],
        dataLabels: {
          enabled: false,
        },
        legend: {
          enabled: true
        },
      },
      series: [
        {
          name: "series-1",
          data: data,
        },
      ],
    }));
  }

  /**
   * Sets the chart data to show the bookings for every week
   */
  const showWeeks = async () => {
    setBookingsChartData((bookingsChartData) => ({
      ...bookingsChartData,
      options: {
        ...bookingsChartData.options,
        chart: {
          id:"booking"
        },
        xaxis: {
          categories: new Array(52).fill(0).map((_, i) => i + 1),
        },
      },
      series: [
        {
          name: "series-1",
          data: getWeeksBookings(bookings),
        },
      ],
    }));
  }
  
  const sortDegrees = (users: any, bookings: booking[] ) => {
    if (users.length === 0) {console.log("No users found"); return;}
    
    let uniqueUsers = [] as any[];
    bookings.forEach((booking) => {
      const index = uniqueUsers.findIndex((user) => user.studentNumber === booking.studentNumber);
      if(index === -1) {
        uniqueUsers.push(users.find((user: any) => user.studentNumber === booking.studentNumber));
      }
    });
    
    let sortedDegrees = [] as {name: string, count: number}[];
    uniqueUsers.forEach((user: any) => {
      const currentDegree = user.degree;
      const index = sortedDegrees.findIndex((degree) => (currentDegree).toLowerCase().replace(/\s/g, '') === (degree.name).toLowerCase().replace(/\s/g, ''));
      if(index === -1) {
        sortedDegrees.push({name: currentDegree, count: 1});
      } else {
        sortedDegrees[index].count++;
      }
    })
    sortedDegrees.sort((a, b) => b.count - a.count);
    setDegreeChartData((degreeChartData) => ({
      ...degreeChartData,
      series: sortedDegrees.map((degree) => degree.count),
      options: {
        ...degreeChartData.options,
        chart: {
          width: 380,
          id:"pie"
        },
        labels: sortedDegrees.map((degree) => degree.name),
        colors: ["#00325d", "#004683", "#005baa", "#006fd0", "#0083f6", "#0076ff"],
        dataLabels: {
          enabled: true,
          formatter: function (val: any) {
            return val.toFixed(2) + "%" + " (" + Math.round((val * sortedDegrees.reduce((a, b) => a + b.count, 0)) / 100) + ")";
          },
        },
        legend: {
          enabled: true,
          position: window.innerWidth > 480 ? 'right' : 'bottom',
          horizontalAlign: 'left',
          width: window.innerWidth > 480 ? 280 : graphWidth,
          fontSize: window.innerWidth > 480 ? '12px' : '10px',
        },
      }
    }));
  }
  
  return (
    <>
      {
        loading ? <Loader color={"#005baa"} size={30}/> :
          <div className="w-full">
            <div className="bookingCounts text-primary w-full items-center rounded-xl mt-2 px-3 py-3">
              <h1 className="mb-4 w-full text-center">Analytics</h1>
              <div className="flex flex-col items-center">
                <div className="text-xl mb-4 font-title w-full text-center">Total Bookings</div>
                <div className="flex justify-around w-full lg:w-2/3 xl:w-1/3">
                  <div
                    className="flex flex-col items-center justify-center w-24 h-24 border-2 border-primary rounded-full">
                    <div
                      className="font-bold">{bookings.filter((booking) => booking.date.split("-")[0] === new Date().getFullYear().toString()).length}</div>
                    <div className="text-sm">This year</div>
                  </div>
                  <div
                    className="flex flex-col items-center justify-center w-28 h-28 border-2 border-primary rounded-full bg-primary text-white">
                    <div className="font-bold">{monthsWithBookings === 0 ? 0 : (((getMonthsBookings(bookings)).reduce((a, b) => a + b, 0)) / monthsWithBookings).toFixed(2)}</div>
                    <div className="text-sm">Avg/Month</div>
                  </div>
                  <div
                    className="flex flex-col items-center justify-center w-24 h-24 border-2 border-primary rounded-full">
                    <div
                      className="font-bold">{bookings.filter((booking) => booking.date.slice(0, 7) === new Date().toISOString().slice(0, 7)).length}</div>
                    <div className="text-sm">This month</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col 2xl:flex-row">
              <div className={"flex flex-col items-center"}>
                <h2 className="text-xl font-title text-primary mt-4">Bookings Over Time</h2>
                <div className={"flex flex-col items-center relative"}>
                  {bookingChart}
                  <button onClick={() => setShowWeek(!showWeek)}
                          className="bg-primary text-white text-xs rounded-lg px-2 py-1 mt-4 absolute right-3 top-3">Show {showWeek ? "Months" : "Weeks"}</button>
                </div>
              </div>
              <div className={"flex flex-col items-center"}>
                <h2 className="text-xl font-title text-primary mt-4">Degrees</h2>
                {degreeChart}
                </div>
            </div>
            <div className="spacer mt-12"></div>
          </div>
      }
    </>

  )


}