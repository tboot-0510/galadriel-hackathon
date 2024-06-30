// https://www.xweather.com/docs/weather-api/endpoints/phrases-summary

export function formatPhrasesSummary(phrase: any) {
  if (!phrase) return "";
  return [phrase[0]?.phrases?.longMET];
}

export function formatPhrasesResponse(phraseResp: any) {
  return phraseResp[0];
}
