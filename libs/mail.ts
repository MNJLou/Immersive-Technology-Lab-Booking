// mail.ts: Create the HTML for each email

/**
 * Create the HTML for the confirmation email
 * @param bookings
 * @param devBooking
 * @param formattedDate
 */
export const confirmationHtml = (bookings: any, devBooking: boolean, formattedDate: string) => {
    
    return '<div style="color: #2e2f32"><h2 style="color: #196bb2">Immersive Technology Lab</h2>' +
      '<hr>' +
      '<h1 style="color: #196bb2">Booking Confirmation</h1>' +
      '<h3 style="color: #196bb2">Details:</h3>' +
      '<ul>' +
      '<li>Booking: ' + (devBooking ? "Development booking (55 minutes)" : "Play booking (25 minutes)") + '</li>' +
      '<li>Date: ' + formattedDate + '</li>' +
      '<li>Time' + (bookings.length > 1 ? 's' : '') + ':'  + bookings.map((booking: { start: string }) => booking.start).join(", ") + '</li>' +
      '<li>Location: Room 4-62, Level 4, Department of Information Science, IT Building, Hillcrest, Pretoria, 0083</li>' +
      '</ul>' +
      '<br>' +
      '<p>Thank you for booking at the Immersive Technology Lab. Your booking should be automatically added to your calendar.</p>' +
      '<p>If you would like to see or cancel your booking, return to the <a href="' + (process.env.NEXT_PUBLIC_URL as string) + '">Immersive Technology Lab Booking</a> website.</p>' +
      '<p>You can find out more information about the lab here on the <a href="https://www.up.ac.za/information-science/article/3218395/immersive-technology-lab">Information Science</a> section of the University of Pretoria website.</p>' +
      '<p>For any questions or concerns regarding your booking, please contact the lab administrator at <a href="mailto:jerome.lou@up.ac.za"></a>jerome.lou@up.ac.za</p></div>';
}

/**
 * Create the HTML for the cancellation email
 * @param devBooking 
 * @param formattedDate
 * @param times
 */
export const cancellationHtml = (devBooking: boolean, formattedDate: string, times: string[]) => {
  
  times = times.sort()
  
  return '<h2>Immersive Technology Lab</h2>' +
    '<hr>' +
    '<h1>Booking Cancellation' + (times.length > 1 ? 's' : '') + '</h1>' +
    '<p>Your ' + (devBooking ? "development" : "play") + ' booking' + (times.length > 1 ? 's' : '') + ' for ' + formattedDate + ' at ' + (times.length > 1 ? '(' + times.sort().join(', ') + ') have ' : times[0] + ' has ') + 'been cancelled.</p>' +
    '<p>If you would like to rebook, please return to the <a href="' + (process.env.NEXT_PUBLIC_URL as string) + '">Immersive Technology Lab Booking</a> website.</p>' +
    '<p>For any questions or concerns regarding bookings, please contact the lab administrator at <a href="mailto:jerome.lou@up.ac.za"></a>jerome.lou@up.ac.za</p>';
}