"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  YMapEntity,
  type DomEvent,
  type DomEventHandler,
  type DomEventHandlerObject,
  type LngLat,
  type YMap,
  type YMapLocationRequest,
} from "ymaps3";

import { useMap } from "@/app/providers/map-provider";

interface MapProps {
  onLocationChange?: (lnglat: LngLat) => void;
  width?: string;
  height?: string;
}

function initMapLoader(onClick?: DomEventHandler) {
  let loadedMap: null | YMap = null;
  return {
    loadMap: () => {
      if (!loadedMap) {
        const LOCATION: YMapLocationRequest = {
          center: [30.334574119049794, 53.88162941583986],
          zoom: 11,
        };
        const {
          YMap,
          YMapDefaultSchemeLayer,
          YMapListener,
          YMapFeatureDataSource,
          YMapDefaultFeaturesLayer,
        } = ymaps3;
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
          map.addChild(new YMapDefaultFeaturesLayer({}));
          map.addChild(
            new YMapFeatureDataSource({
              id: "featureSource",
            })
          );
          map.addChild(mapListener);
          loadedMap = map;
          return map;
        }

        return null;
      } else {
        return loadedMap;
      }
    },
  };
}

export default function Map({ width, height, onLocationChange }: MapProps) {
  const { mapScriptLoaded } = useMap();
  const map = useRef<YMap | null>(null);
  const previusMarker = useRef<YMapEntity<unknown> | null>(null);
  const rerenderMarker = (coordinates: LngLat) => {
    const markerElement = document.createElement("div");
    markerElement.className =
      "flex flex-col items-center justify-center transform -translate-y-[100%] -translate-x-[50%]";

    // Create the red circle (head of the pin)
    const markerHead = document.createElement("div");
    markerHead.className = "bg-red-500 rounded-full w-4 h-4 top-0 transform";

    // Create the black line (pin)
    const markerLine = document.createElement("div");
    markerLine.className = "bg-black w-0.5 h-3 transform";

    // Append the head and line to the marker element
    markerElement.appendChild(markerHead);
    markerElement.appendChild(markerLine);
    const marker = new ymaps3.YMapMarker(
      {
        coordinates,
      },
      markerElement
    );

    if (previusMarker.current) map.current!.removeChild(previusMarker.current);

    map.current?.addChild(marker);
    previusMarker.current = marker;
  };
  const onMapClick = useCallback(
    (_layer: DomEventHandlerObject, { coordinates }: DomEvent) => {
      onLocationChange?.(coordinates);
      rerenderMarker(coordinates);
    },
    [onLocationChange]
  );
  const mapLoader = useRef(initMapLoader(onMapClick));
  useEffect(() => {
    if (mapScriptLoaded) {
      map.current = mapLoader.current.loadMap();
    }
  }, [mapScriptLoaded, onMapClick]);
  return <div id="map" style={{ width, height }}></div>;
}
