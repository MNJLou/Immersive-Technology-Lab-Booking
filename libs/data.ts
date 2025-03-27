// === DISABLING === //
/* Used to disable specific dates. */

export const disabledDates: string[] = [
    "2024-07-01",
    "2024-07-02",
    "2024-07-03",
    "2024-07-04",
    "2024-07-05",
    "2024-07-08",
    "2024-07-09",
    "2024-07-10",
    "2024-07-11",
    "2024-07-12",
    "2024-07-15",
    "2024-07-16",
    "2024-07-17",
    "2024-07-18",
    "2024-07-19",
    "2024-09-18",
    "2024-09-19",
    "2024-09-20",
    "2024-09-21",
    "2024-09-22",
    "2024-09-23",
    "2024-09-24",
    "2024-09-25",
    "2024-09-26",
    "2024-09-27",
    "2024-09-28",
    "2024-09-29",
    "2024-09-30",
    "2024-10-24",
    "2024-11-01",
    "2024-11-06",
    "2024-11-07",
    "2024-11-18",
    "2024-11-21",
    "2024-11-25",
    "2025-02-10",
    "2025-02-11",
    "2025-02-12",
    "2025-02-13",
    "2025-02-14",
    "2025-02-19",
    "2025-03-20",
    "2025-03-27",
    "2025-04-03",
    "2025-04-10",
    "2025-03-21",
]

/* Used to disable specific times on specific dates. */
export const disabledDayTimes = {
    "2024-05-31": ["13:00", "13:30"],
    "2024-06-03": ["10:00"],
    "2024-05-27": ["10:00", "10:30"],
    "2024-07-08": ["13:00", "13:30"],
    "2024-07-19": ["09:00", "09:30", "10:00", "10:30"],
    "2024-07-26": ["13:00", "13:30"],
    "2024-10-08": ["09:00, 09:30"],
    "2024-11-05": ["13:00", "13:30"],
    "2024-11-28": ["13:00", "13:30"],
    "2025-03-12": ["10:00", "10:30"],
    "2025-03-14": ["11:00", "11:30", "13:00"],
    "2025-03-19": ["13:00", "13:30"],
    "2025-04-08": ["13:00", "13:30"],
    "2025-03-31": ["11:00", "11:30"],
} as { [key: string]: string[] };

// === BOOKING CONSTANTS === //
export const DEV_PODS = 3;
export const PLAY_PODS = 3;

export const MAX_DEV_BOOKINGS = 5;
export const MAX_PLAY_BOOKINGS = 5;
