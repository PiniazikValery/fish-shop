"use client";

import { LngLat } from "@yandex/ymaps3-types";
import Script from "next/script";
import { createContext, useCallback, useContext, useState } from "react";

export const MapContext = createContext<{
  mapScriptLoaded: boolean;
  coordsToAddress: (lnglat: LngLat) => Promise<string>;
}>({
  mapScriptLoaded: false,
  coordsToAddress: () => {
    throw new Error("Not initialized");
  },
});

export const MapProvider: React.FC<{
  children?: React.ReactNode;
}> = (props) => {
  const [mapScriptLoaded, setMapLoaded] = useState(false);

  const coordsToAddress = useCallback(
    async (lnglat: LngLat) => {
      if (mapScriptLoaded) {
        const address = await ymaps3.search({
          text: lnglat.toString(),
        });
        const { description, name } = address[0].properties;
        return `${description}, ${name}`;
      } else {
        throw new Error("Map not initialized");
      }
    },
    [mapScriptLoaded]
  );

  return (
    <MapContext.Provider
      value={{
        mapScriptLoaded,
        coordsToAddress,
      }}
    >
      <Script
        src={`https://api-maps.yandex.ru/v3/?apikey=${process.env.NEXT_PUBLIC_YA_MAPS_KEY}&lang=en_US`}
        strategy="afterInteractive"
        onLoad={async () => {
          await ymaps3.ready;
          setMapLoaded(true);
        }}
      />
      {props.children}
    </MapContext.Provider>
  );
};

export const useMap = () => useContext(MapContext);
