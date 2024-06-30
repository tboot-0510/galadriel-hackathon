import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';

const Clock = ({ city }: any) => {
  const timezone  = Math.abs(city.timezone/60);
  const localTimezone = moment.tz.zonesForCountry(city.country, true).filter((zone) => zone.offset === timezone)?.[0];
  if (!localTimezone) return <></>
  const [time, setTime] = useState(moment.tz(localTimezone.name).format('MMMM Do YYYY, h:mm:ss a'));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(moment.tz(localTimezone.name).format('MMMM Do YYYY, h:mm:ss a'));
    }, 1000);

    return () => clearInterval(interval);
  }, [localTimezone]);

  return (
      <p className="text-gray-500 text-sm">{time}</p>
  );
};

export default Clock;
