import ms from "ms";

export function convertToDate(
  timezone: number,
  dt: number,
  weekdayFormat: "short" | "long"
): string {
  let utc_time = new Date(dt * 1000);
  let local_time = new Date(utc_time.getTime() + timezone * 1000);

  const options = { weekday: weekdayFormat };
  const dateFormatter = new Intl.DateTimeFormat("UTC", options);

  return dateFormatter.format(local_time);
}

function getMonthNumber(monthName: string) {
  const months: any = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };
  return months[monthName];
}

export function convertToISODate(dateString: string) {
  if (!dateString) return new Date();
  const [day, month, year] = dateString.split("/");
  const isoDate = new Date(year, month, day);
  return isoDate;
}

export function formatDate(
  dateString: any,
  options = { day: "2-digit", month: "short", year: "numeric" }
) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", options);
}

export function getTime(localTime: any) {
  const hours = localTime.getHours().toString().padStart(2, "0");
  const minutes = localTime.getMinutes().toString().padStart(2, "0");
  const seconds = localTime.getSeconds().toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

export function getUnixTimestamp(date = new Date()) {
  const beginningOfDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  return Math.floor(beginningOfDay.getTime() / 1000);
}

export function getUnixTimestampDayBefore(date = new Date()) {
  let previousDay = new Date(date);
  previousDay.setDate(date.getDate() - 1);
  return getUnixTimestamp(previousDay);
}

export function getOneYearBefore(date: any) {
  const oneYearBefore = new Date(date);
  oneYearBefore.setFullYear(date.getFullYear() - 1);
  return oneYearBefore.toISOString().split("T")[0];
}

export function getActualTimeForTimezone(shift: any) {
  const now = new Date();
  return new Date(now.getTime() + shift * 1000);
}

export function getOneDayBefore(date: any) {
  let previousDay = new Date(date);
  previousDay.setDate(date.getDate() - 1);
  return formatDateTime(previousDay);
}

export function getOneDayAfter(date: any) {
  let nextDay = new Date(date);
  nextDay.setDate(date.getDate() + 1);
  return formatDateTime(nextDay);
}

export const formatDateTime = (utcDateString: any, withYear = false) => {
  const utcDate = new Date(utcDateString);

  let options = {
    month: "short",
    day: "numeric",
  };

  if (withYear) {
    options.year = "numeric";
  }

  return new Intl.DateTimeFormat("en-US", options).format(utcDate);
};

export const timeAgo = (time: number): string => {
  if (!time) return "Never";
  return `${ms(Date.now() - new Date(time).getTime())} ago`;
};

export const getDaysInMonth = () => {
  const date = new Date();
  const month = date.getMonth();
  const year = date.getFullYear();
  return new Date(year, month + 1, 0).getDate();
};
