import { getDb } from "@/db";
import { ChatId } from "@/db/entity/ChatId";
import { Bot } from "grammy";

 const TELEGRAM_TOKEN = process.env.NEXT_TELEGRAM_TOKEN as string;
  export const bot = new Bot(TELEGRAM_TOKEN);

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
