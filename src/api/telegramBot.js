import TelegramBot from "node-telegram-bot-api";
import express from "express";
import cors from "cors";
import telegramConfig from "../config/telegramConfig.js";

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
        const begin = new Date(data.startTime)
          .toLocaleTimeString()
          .slice(0, -3);
        const end = new Date(reqBody.endTime).toLocaleTimeString().slice(0, -3);

        await bot.sendMessage(
          chatId,
          "Дякуємо, запис прийнято!" +
            "\n Процедура: " +
            data.name +
            "\n Дата запису: " +
            new Date(data.startTime).toLocaleString().split(",")[0] +
            "\n Початок: " +
            begin +
            "\n Завершення: " +
            end +
            "\n Телефон майстра: "
        );
        await bot.sendMessage(chatId, "0634748925");
      } catch (err) {
        console.error(err);
      }
    }
  } catch (error) {
    console.error(error);
  }
});
