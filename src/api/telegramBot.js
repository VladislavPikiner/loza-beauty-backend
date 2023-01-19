import TelegramBot from "node-telegram-bot-api";
import express from "express";
import cors from "cors";
import telegramConfig from "../config/telegramConfig.js";

const app = express();

app.use(express.json());
app.use(cors());

const webAppUrl = "http://localhost:5173";

const bot = new TelegramBot(telegramConfig.telegram.token, { polling: true });

export const telegramBot = bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  try {
    if (text === `/start`) {
      await bot.sendMessage(
        chatId,
        `Вітаю! Я Loza-beauty Bot 👋\n Оберіть одну з функцій: `,
        {
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: `🙋🏼‍♀️ онлайн-чат з майстром`,
                  url: `http://t.me/VAZA_flowershop`,
                },
              ],
              [
                {
                  text: `🕗 онлайн-запис`,
                  web_app: { url: webAppUrl },
                },
                {
                  text: `🔔 зворотній зв'язок (анонімно)`,
                  web_app: { url: webAppUrl + "/feedback" },
                },
              ],
            ],
          },
        }
      );
    }
  } catch (error) {
    console.error(error);
  }
});
