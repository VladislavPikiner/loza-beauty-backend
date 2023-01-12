import VacationSchema from "../models/Vacation.js";
import VacationSchema from "../models/Vacation.js";

export const createVacations = async (req, res) => {
  try {
    const { from, to } = req.body;
    const doc = new VacationSchema({
      from,
      to,
    });

    const vacation = await doc.save();

    res.status(200).json(vacation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Не удалось создать отпуск" });
  }
};

export const getVacations = async (req, res) => {
  try {
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Не удалось загрузить отпуска" });
  }
};
