import TelegramBot from "node-telegram-bot-api";
import express from "express";
import cors from "cors";
import telegramConfig from "../config/telegramConfig.js";
import ServiceSchema from "../models/Service.js";
const app = express();

app.use(express.json());
app.use(cors());

const webAppUrl = "https://loza-beauty.netlify.app";

const bot = new TelegramBot(telegramConfig.telegram.token, { polling: true });

export const telegramBot = bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  try {
    if (text === `/start`) {
      await bot.sendMessage(chatId, `Вітаю! Я Loza-beauty Bot 👋 `, {
        parse_mode: "HTML",
        reply_markup: {
          keyboard: [
            [
              {
                text: `🙋🏼‍♀️ онлайн-чат з майстром`,
                url: `https://t.me/VAZA_flowershop`,
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
      });
    }

    if (text === `🙋🏼‍♀️ онлайн-чат з майстром`) {
      await bot.sendMessage(chatId, `Натисність, щоб перейти ⬇️`, {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: `🙋🏼‍♀️ онлайн-чат з майстром`,
                url: `https://t.me/VAZA_flowershop`,
              },
            ],
          ],
        },
      });
    }

    if (msg?.web_app_data?.data) {
      try {
        const data = JSON.parse(msg?.web_app_data?.data);
        console.log(data.startDate);

        await bot.sendMessage(
          chatId,
          "Дякуємо, запис прийнято!" +
            "\n Процедура: " +
            data.name +
            "\n Дата запису: " +
            new Date(data.startTime).toLocaleDateString() +
            "\n Початок: " +
            data.startTime.split("T")[1].slice(0, -8) +
            "\n Завершення: " +
            data.endTime.split("T")[1].slice(0, -8) +
            "\n Телефон майстра: "
        );

        setTimeout(async () => {
          await bot.sendMessage(chatId, "0634748925");
        }, 1000);
      } catch (err) {
        console.error(err);
      }
    }
  } catch (error) {
    console.error(error);
  }
});
