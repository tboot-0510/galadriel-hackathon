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
  const [day, month, year] = dateString.split(" ");

  const isoDate = new Date(
    `${year}-${getMonthNumber(month)}-${day}T00:00:00.000Z`
  );

  return isoDate;
}

export function formatDate(dateString: any) {
  const options = { day: "2-digit", month: "short", year: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", options);
}

export function getOneYearBefore(date: any) {
  const oneYearBefore = new Date(date);
  oneYearBefore.setFullYear(date.getFullYear() - 1);
  return oneYearBefore.toISOString().split("T")[0];
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
