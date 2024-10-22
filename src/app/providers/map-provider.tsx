"use client";

import Script from "next/script";
import { createContext, useContext, useState } from "react";

export const MapContext = createContext({
  mapLoaded: false,
});

export const MapProvider: React.FC<{
  children?: React.ReactNode;
}> = (props) => {
  const [mapLoaded, setMapLoaded] = useState(false);

  return (
    <MapContext.Provider value={{ mapLoaded }}>
      <Script
        src={
          process.env.NEXT_PUBLIC_NODE_ENV_LOCAL === "local"
            ? "/api/yandex-map"
            : `https://api-maps.yandex.ru/v3/?apikey=${process.env.NEXT_PUBLIC_YA_MAPS_KEY}&lang=en_US`
        }
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
