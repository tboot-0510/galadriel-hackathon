// https://www.xweather.com/docs/weather-api/endpoints/fires-outlook

const getCategoryName = {
  firewx: "fire weather outlooks",
  dryltg: "dry lightning outlook",
};

export function formatFireOutlook(firesResp: any) {
  if (!firesResp) return [];
  return firesResp?.map((fire: any) => {
    return {
      category: getCategoryName[fire.details.category],
      day: fire.details.day,
      risk: fire.details.risk.name,
      eventTime: fire.details.issuedDateTimeISO,
      minRangeTime: fire.details.range.minDateTimeISO,
      maxRangTime: fire.details.range.maxDateTimeISO,
    };
  });
}

export function formatFireResponse(fireResp: any) {
  const sortedByDay = fireResp.sort((a: any, b: any) => a.day - b.day);
  return sortedByDay?.map((item: any) => {
    const { category, day, risk } = item;
    return `Day: ${day}, risk for ${category}: ${risk}. `;
  });
}
