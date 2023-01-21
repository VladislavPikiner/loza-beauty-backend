import FeedbackSchema from "../models/Feedback.js";
import request from "request";
import telegramConfig from "../config/telegramConfig.js";

export const create = async (req, res) => {
  try {
    const { star, message, contact } = req.body;

    const doc = new FeedbackSchema({ star, message, contact });
    const feedback = await doc.save();

    res.json(feedback);
  } catch (error) {
    console.error(error);
  }
};

export const feedbackNotification = async (req, res, next) => {
  //токен и id чата берутся из telegramConfig.js
  try {
    let reqBody = req.body;

    //каждый элемент обьекта запихиваем в массив
    let fields = [
      " 🔔<b>ФОРМА ЗВОРОТНОГО ЗВ'ЯЗКУ</b>",
      "⭐<b>Оцінка</b>: " + reqBody.star,
      "📞<b>Контакт Клієнта</b>: " + reqBody.contact,
      "✉️<b>Звернення</b>: " + reqBody.message,
    ];
    let msg = "";
    //проходимся по массиву и склеиваем все в одну строку
    fields.forEach((field) => {
      msg += field + "\n";
    });
    //кодируем результат в текст, понятный адресной строке
    msg = encodeURI(msg);
    //делаем запрос
    await request.post(
      `https://api.telegram.org/bot${telegramConfig.telegram.token}/sendMessage?chat_id=${telegramConfig.telegram.chat}&parse_mode=html&text=${msg}`,
      function (error, response, body) {
        //не забываем обработать ответ
        console.log("error:", error);
        console.log("statusCode:", response && response.statusCode);
        console.log("body:", body);

        if (response.statusCode !== 200) {
          res
            .status(400)
            .json({ status: "error", message: "Произошла ошибка!" });
        }
      }
    );
    next();
  } catch (error) {
    console.error(error);
  }
};
