// import { getBot } from "@/app/lib/telegram";
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   const bot = await getBot();
//   const body = await req.json();

//   await bot.handleUpdate(body);

//   return NextResponse.json({ status: "Message processed" });
// }
export const dynamic = 'force-dynamic'

export const fetchCache = 'force-no-store'

import { webhookCallback } from 'grammy'
import { bot } from "@/app/lib/telegram";

export const POST = webhookCallback(bot, 'std/http')

