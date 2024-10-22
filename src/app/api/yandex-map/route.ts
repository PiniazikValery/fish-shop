import { NextResponse } from "next/server";

export async function GET() {
  const yandexApiUrl = `https://api-maps.yandex.ru/v3/?apikey=${process.env.NEXT_PUBLIC_YA_MAPS_KEY}&lang=en_US`;

  try {
    const response = await fetch(yandexApiUrl);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch Yandex Maps API: ${response.statusText}`
      );
    }

    const script = await response.text();

    return new NextResponse(script, {
      headers: { "Content-Type": "application/javascript" },
    });
  } catch (error) {
    console.error("Error fetching Yandex Maps API:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to load Yandex Maps API" }),
      { status: 500 }
    );
  }
}
