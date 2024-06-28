"use client"
import "mapbox-gl/dist/mapbox-gl.css"
import { useEffect, useMemo, useState } from "react"
import ReactMapGL, { Layer, LayerProps, NavigationControl, Source } from "react-map-gl"
// import { Card } from "../ui/card"
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../ui/select"

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
const OPENWEATHERMAP_TOKEN = process.env.NEXT_PUBLIC_OPEN_WEATHER_API_KEY

export default function Map({lat, lon}:{lat:number, lon:number}) {

  const weatherTiles = useMemo(() => {
    return [
      { label: "Temperature (°C)", code: "TA2" },
      { label: "Precipitation Intensity (mm/s)", code: "PR0" },
      { label: "Wind Speed and Direction (m/s)", code: "WND" },
      { label: "Relative Humidity (%)", code: "HRD0" },
      { label: "Cloudiness (%)", code: "CL" },
      { label: "Atmospheric Pressure (hPa)", code: "APM" },
    ]
  }, [])

  const weatherLayer: LayerProps = {
    id: "weatherLayer",
    type: "raster",
    minzoom: 0,
    maxzoom: 15,
  }

  const [viewport, setViewport] = useState({
    latitude: lat ,
    longitude: lon,
    zoom: 5,
    pitch: 40,
  })

  const [MapCode, setMapCode] = useState("precipitation_new")

  useEffect(() => {
    setViewport((prevViewport) => ({
      ...prevViewport,
      latitude: lat ,
      longitude: lon,
    }))
  }, [lat, lon])

  return (
    <div className="order-11 col-span-2 h-[25rem] overflow-hidden overscroll-contain  p-0 md:p-0 xl:col-span-3">
      {/* <div className="absolute right-0 z-10 m-2">
        <Select value={MapCode} onValueChange={setMapCode}>
          <SelectTrigger aria-label="Map layer" className="w-fit">
            <SelectValue placeholder="Map Layers" />
          </SelectTrigger>
          <SelectContent align="end">
            <SelectGroup>
              {weatherTiles.map((tile) => (
                <SelectItem key={tile.code} value={tile.code}>
                  {tile.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div> */}
      <ReactMapGL
        reuseMaps
        {...viewport}
        attributionControl={false}
        mapboxAccessToken={MAPBOX_TOKEN}
        onMove={(evt) => setViewport(evt.viewState)}
        mapStyle={`mapbox://styles/mapbox/dark-v11`}
        style={{
          flex: "1",
          position: "relative",
          width: "100%",
          height: "100%",
          top: "0",
          left: "0",
          zIndex: 0,
        }}
      >
        <Source
          key={MapCode}
          id="weatherSource"
          type="raster"
          tiles={[
            // `https://maps.openweathermap.org/maps/2.0/weather/1h/${MapCode}/{z}/{x}/{y}?appid=${OPENWEATHERMAP_TOKEN}`,
            `https://tile.openweathermap.org/map/${MapCode}/{z}/{x}/{y}.png?appid=${OPENWEATHERMAP_TOKEN}`
          ]}
          tileSize={256}
        >
          <Layer {...weatherLayer}/>
        </Source>
        <NavigationControl />
      </ReactMapGL>
    </div>
  )
}