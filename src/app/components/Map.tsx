"use client";

import { useEffect } from "react";
import type { DomEventHandler, YMapLocationRequest } from "ymaps3";

import { useMap } from "@/app/providers/map-provider";

async function injectMap(onClick?: DomEventHandler) {
  const LOCATION: YMapLocationRequest = {
    center: [30.334574119049794, 53.88162941583986],
    zoom: 11,
  };
  const { YMap, YMapDefaultSchemeLayer, YMapListener } = ymaps3;
  const mapListener = new YMapListener({
    layer: "any",
    onClick: onClick,
  });
  const mapElement = document.getElementById("map");
  if (mapElement) {
    const map = new YMap(mapElement, {
      location: LOCATION,
    });
    map.addChild(new YMapDefaultSchemeLayer({}));
    map.addChild(mapListener);
  }
}

export default function Map() {
  const { mapLoaded } = useMap();
  useEffect(() => {
    if (mapLoaded) {
      injectMap((layer, coordinates) => {
        console.log("layer: ", layer);
        console.log("coordinates: ", coordinates);
        // console.log("object: ", object);
        console.log("User clicked on map");
        ymaps3
          .search({ text: coordinates.coordinates.toString() })
          .then((test) => {
            console.log("test: ", test);
          });
      });
    }
  }, [mapLoaded]);
  return <div id="map" style={{ width: 700, height: 700 }}></div>;
}
