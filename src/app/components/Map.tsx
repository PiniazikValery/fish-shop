"use client";

import { useEffect } from "react";
import type { YMapLocationRequest } from "ymaps3";

import { useMap } from "@/app/providers/map-provider";

async function injectMap() {
  const LOCATION: YMapLocationRequest = {
    center: [30.1, 53.96],
    zoom: 9,
  };
  const { YMap, YMapDefaultSchemeLayer } = ymaps3;
  const mapElement = document.getElementById("map");
  if (mapElement) {
    const map = new YMap(mapElement, {
      location: LOCATION,
    });
    map.addChild(new YMapDefaultSchemeLayer({}));
  }
}

export default function Map() {
  const { mapLoaded } = useMap();
  useEffect(() => {
    if (mapLoaded) {
      injectMap();
    }
  }, [mapLoaded]);
  return <div id="map" style={{ width: 700, height: 700 }}></div>;
}
