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

    const vacationFormatted = vacations.map(({ _id, from, to }) => {
      return { from, to, _id };
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

export const removeVacation = async (req, res) => {
  try {
    const vacationId = req.params.id;
    console.log(vacationId);
    await VacationSchema.findByIdAndRemove({ _id: vacationId });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Не удалось delete отпуска" });
  }
};
