import RecordSchema from "../models/Record.js";

export const create = async (req, res) => {
  try {
    const { name, price, clientName, clientPhone, date, startTime, endTime } =
      req.body;
    const doc = new RecordSchema({
      name,
      price,
      clientName,
      clientPhone,
      date,
      startTime,
      endTime,
    });

    const record = await doc.save();

    res.json(record);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Не удалось создать запись" });
  }
};

export const getAllRecords = async (req, res) => {
  try {
    const allRecords = await RecordSchema.find();

    res.json(allRecords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Не удалось загрузить записи" });
  }
};

export const getAvailableRecords = async (req, res) => {
  try {
    const today = new Date().toLocaleDateString();
    console.log(today);
    const availableRecords = await RecordSchema.find().where("date").gt(today);

    res.json(availableRecords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Не удалось загрузить записи" });
  }
};

export const deleteRecord = async (req, res) => {
  const recordId = req.params.id;
  try {
    await RecordSchema.findByIdAndDelete({ _id: recordId });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Не удалось удалить запись" });
  }
};
