import mongoose, { Schema } from "mongoose";
import ConsumableSchema from "../models/Consumable.js";
import RecordSchema from "../models/Record.js";

export const create = async (req, res) => {
  try {
    const {
      service,
      clientName,
      clientPhone,
      startDate,
      startTime,
      endTime,
      comment,
    } = req.body;

    const doc = new RecordSchema({
      service: mongoose.Types.ObjectId(service),
      clientName,
      clientPhone,
      startDate,
      startTime,
      endTime,
      comment,
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
    const allRecords = await RecordSchema.find({ complete: false })
      .populate({ path: "service", model: "Service" })
      .exec();

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
    const availableRecords = await RecordSchema.find({ complete: false })
      .where("date")
      .gt(today);

    res.json(availableRecords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Не удалось загрузить записи" });
  }
};

export const getArchiveRecords = async (req, res) => {
  try {
    const today = new Date().toLocaleDateString();
    console.log(today);
    const archiveRecords = await RecordSchema.find({ complete: true })
      .where("date")
      .gt(today)
      .populate({ path: "service", model: "Service" });

    res.json(archiveRecords);
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

export const updateRecord = async (req, res) => {
  const recordId = req.params.id;
  try {
    const completeRecord = await RecordSchema.findByIdAndUpdate(
      { _id: recordId },
      { complete: true }
    )
      .populate({ path: "service", model: "Service" })
      .exec();
    const consumables = completeRecord.service.consumable;

    consumables.map(async ({ consumableId, amount }) => {
      try {
        const findConsumables = await ConsumableSchema.find({
          _id: consumableId,
        });
        const cost = findConsumables[0].price * amount;

        await ConsumableSchema.findByIdAndUpdate(
          { _id: consumableId },
          { $inc: { amount: -amount, totalCost: -cost } }
        );

        const updated = await ConsumableSchema.find({ _id: consumableId });
        console.log(updated);
        if (updated.amount < 0 || updated.totalCost < 0) {
          await ConsumableSchema.updateOne(
            { _id: consumableId },
            { $set: { amount: 0, totalCost: 0 } }
          );
        }
      } catch (error) {
        console.error(error);
      }
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Не удалось удалить запись" });
  }
};

export const unavailableTime = async (req, res) => {
  try {
    const availabilityFrom = new Date();
    const availabilityTo = new Date(
      availabilityFrom.setDate(availabilityFrom.getDate() + 33)
    );
    const availabilityFromFormatted = new Date().toLocaleDateString();
    const availabilityToFormatted = availabilityTo.toLocaleDateString();

    const records = await RecordSchema.find()
      .populate({ path: "service", model: "Service" })
      .exec();

    const unavailableSlots = records.map((record) => {
      const duration = record.service.duration / 1000 / 60;
      const start = new Date();
      start.setDate(+record.startDate.split(".")[0]);
      start.setMonth(+record.startDate.split(".")[1] - 1);
      start.setFullYear(+record.startDate.split(".")[2]);
      start.setHours(+record.startTime.split(":")[0]);
      start.setMinutes(+record.startTime.split(":")[1]);
      const startTimes = start.toISOString().slice(0, -8);

      return {
        from: startTimes,
        duration: duration,
      };
    });

    res.status(200).json(unavailableSlots);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Не удалось загрузить unavailable time slots " });
  }
};
