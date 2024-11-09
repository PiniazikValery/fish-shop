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

import { Bot, webhookCallback } from 'grammy'

const TELEGRAM_TOKEN = process.env.NEXT_TELEGRAM_TOKEN as string;

if (!TELEGRAM_TOKEN) throw new Error('TELEGRAM_BOT_TOKEN environment variable not found.')

const bot = new Bot(TELEGRAM_TOKEN)
 bot.command("start", async () => {
    console.log("bot start");
  });

export const POST = webhookCallback(bot, 'std/http')

