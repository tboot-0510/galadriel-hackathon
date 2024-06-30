// https://www.xweather.com/docs/weather-api/endpoints/stormcells-summary

export function formatStormCellSummary(stormCellResp: any) {
  if (!stormCellResp) return [];

  return stormCellResp?.map((s: any) => {
    const stormCell = s.summary;
    let report = {
      summary: {
        count: stormCell.range.count,
        from: stormCell.range.fromDateTimeISO,
        to: stormCell.range.toDateTimeISO,
        firstCell: stormCell.range.minTimestamp,
        lastCell: stormCell.range.maxTimestamp,
      },
      hail: {
        count: stormCell.hail.prob.count, // summary.hail.prob.count -> prob > 0
        threatCount: stormCell.hail.prob.threatCount, // summary.hail.prob.threatCount -> prob > 70
        maxProb: stormCell.hail.prob.max, // summary.hail.prob.max -> The maximum hail probability value in the summary.
        severeCount: stormCell.hail.probSevere.count, // hail.probSevere.count -> nb cells severe hail probability > 0
        severeThreatCount: stormCell.hail.probSevere.threatCount, // hail.probSevere.threatCount -> severe hail probability >= 30 and potentially threatening in the summary.
      },

      hailSize: {
        count: stormCell.hail.maxSize.count,
        minSize: stormCell.hail.maxSize.minCM,
        avgSize: stormCell.hail.maxSize.avgCM,
        maxSize: stormCell.hail.maxSize.maxCM,
      },
      // dbzm -> number of storm cells with a maximum reflectivity > 0. dBZ (decibels of Z), where higher values indicate more intense precipitation or larger particles.
      dbzm: {
        count: stormCell.dbzm.count,
        min: stormCell.dbzm.min,
        avg: stormCell.dbzm.avg,
        max: stormCell.dbzm.max,
      },
      // vil -> a measurement of the total mass of liquid water droplets contained within a specific volume
      vil: {
        count: stormCell.vil.count,
        min: stormCell.vil.min,
        avg: stormCell.vil.avg,
        max: stormCell.vil.max,
      },
      speed: {
        count: stormCell.speed.count, //-> storm cells with a storm speed > 0
        minKPH: stormCell.speed.minKPH,
        avgKPH: stormCell.speed.avgKPH,
        maxKPH: stormCell.speed.maxKPH,
      },
      traits: stormCell.traits,
    };

    // Tornado vertex signatures
    const tvs = stormCell.tvs;
    // Mesocyclone Detection Algorithm
    const mda = stormCell.mda;

    if (tvs.count > 0) {
      report.tvs = tvs;
    }

    if (mda.count > 0) {
      report.mda = mda;
    }

    return report;
  });
}

export function formatStormCellResponse(stormCellResp: any) {
  return stormCellResp?.map((item: any) => {
    const { summary } = item;
    return `${summary.count} storms forecasted from: ${summary.from} until ${summary.to}`;
  });
}
