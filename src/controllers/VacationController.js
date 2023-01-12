import VacationSchema from "../models/Vacation.js";

export const createVacations = async (req, res) => {
  try {
    const { from, to } = req.body;
    const doc = new VacationSchema({
      from: from,
      to: to,
    });

    const vacation = await doc.save();

    res.status(200).json(vacation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Не удалось создать отпуск" });
  }
};

export const getVacations = async (req, res, next) => {
  try {
    const vacations = await VacationSchema.find();

    const vacationFormatted = vacations.map(({ from, to }) => {
      return { from, to };
    });
    req.body.vacations = vacationFormatted;

    if (req.body.date) {
      next();
    } else res.status(200).json(vacationFormatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Не удалось загрузить отпуска" });
  }
};
