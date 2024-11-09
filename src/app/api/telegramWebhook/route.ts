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
import { getDb } from "@/db";
import { ChatId } from "@/db/entity/ChatId";

const TELEGRAM_TOKEN = process.env.NEXT_TELEGRAM_TOKEN as string;

if (!TELEGRAM_TOKEN) throw new Error('TELEGRAM_BOT_TOKEN environment variable not found.')

const bot = new Bot(TELEGRAM_TOKEN)
 bot.command("start", async (ctx) => {
    console.log("bot start");
    const chatId = ctx.chat.id;

    const db = await getDb();
    const chatIdRepository = db.getRepository(ChatId);
    try {
      // Check if chatId already exists
      const existingChatId = await chatIdRepository.findOne({
        where: { chatId },
      });
      if (!existingChatId) {
        const newChatId = chatIdRepository.create({ chatId });
        await chatIdRepository.save(newChatId);
      }
    } catch (error) {
      console.error("Error saving chatId:", error);
    }
  });

export const POST = webhookCallback(bot, 'std/http')

