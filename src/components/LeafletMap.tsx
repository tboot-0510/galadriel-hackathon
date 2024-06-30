"use client";

import {
  MapContainer,
  Marker,
  TileLayer,
  Tooltip,
  Popup,
  FeatureGroup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { EditControl } from "react-leaflet-draw";
import "leaflet-draw";
import { useEffect, useRef, useState } from "react";

export default function LeafletMap(props: any) {
  const { position, zoom, onPolygonCreated } = props;
  const editableFGRef = useRef();

  const onCreated = (e: any) => {
    const polygons = Object.values(editableFGRef.current._layers).map((layer) =>
      layer.getLatLngs()
    );
    onPolygonCreated((prevState: any) => ({
      ...prevState,
      ...polygons,
    }));

    const drawnItems = editableFGRef.current._layers;
  };

  return (
    <MapContainer
      center={position}
      zoom={zoom}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FeatureGroup
        ref={(ref) => {
          editableFGRef.current = ref;
        }}
      >
        <EditControl
          position="topright"
          onCreated={onCreated}
          draw={{
            polyline: false,
            rectangle: false,
            circle: false,
            circlemarker: false,
          }}
        />
      </FeatureGroup>
      <Marker position={position}>
      </Marker>
    </MapContainer>
  );
}
