// https://www.xweather.com/docs/weather-api/endpoints/convective-outlook

const getCategoryName = {
  cat: "categorical overview",
  torn: "tornado",
  xtorn: "tornado",
  sigtorn: "tornado",
  hail: "hail",
  xhail: "hail",
  sighail: "hail",
  wind: "wind",
  xwind: "wind",
  sigwind: "wind",
};

export function formatConvectiveOutlook(outlookResp: any) {
  if (!outlookResp) return [];

  return outlookResp?.map((outlook: any) => {
    console.log(outlook);
    return {
      category: getCategoryName[outlook.details.category],
      day: outlook.details.day,
      risk: outlook.details.risk.name,
      eventTime: outlook.details.issuedDateTimeISO,
      minRangeTime: outlook.details.range.minDateTimeISO,
      maxRangTime: outlook.details.range.maxDateTimeISO,
    };
  });
}

export function formatConvectiveOutlookResponse(outlookResp: any) {
  const grouped = outlookResp.reduce((acc: any, curr: any) => {
    (acc[curr.day] = acc[curr.day] || []).push(curr);
    return acc;
  }, {});

  return Object.entries(grouped)
    .map(([day, events]) => {
      const risks = events
        .map((event: any) => `${event.category}: ${event.risk}`)
        .join(", ");
      return `Day: ${day}, all risks: ${risks}.`;
    })
    .join("<br />");
}
