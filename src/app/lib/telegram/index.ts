import { getDb } from "@/db";
import { ChatId } from "@/db/entity/ChatId";
import { Api, Bot, Context, RawApi } from "grammy";

let bot: Bot<Context, Api<RawApi>> | undefined = undefined;
let botInitialized = false;

export const initBot = async () => {
  const TELEGRAM_TOKEN = process.env.NEXT_TELEGRAM_TOKEN as string;
  bot = new Bot(TELEGRAM_TOKEN);

  if (process.env.NEXT_PUBLIC_API_URL) {
    bot.api.setWebhook(`${process.env.NEXT_PUBLIC_API_URL}/telegramWebhook`);
  }

  bot.command("start", async (ctx) => {
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

  await bot.init();
  bot.start();
  botInitialized = true;
};

export const getBot = async () => {
  if (!botInitialized) {
    await initBot();
  }
  return bot!;
};
