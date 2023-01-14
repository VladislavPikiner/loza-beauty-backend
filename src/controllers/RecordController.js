import mongoose, { Schema } from "mongoose";
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
    const allRecords = await RecordSchema.find()
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
    await RecordSchema.findByIdAndUpdate({ _id: recordId }, { complete: true });

    res.json({ success: true });
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
    const availabilityFromFormatted = new Date().toISOString();
    const availabilityToFormatted = availabilityTo.toISOString();

    console.log(availabilityFromFormatted < availabilityToFormatted);
    console.log(availabilityFromFormatted);
    console.log(availabilityToFormatted);
    const records = await RecordSchema.find()
      .where("startTime")
      .gt(availabilityFromFormatted)
      .lt(availabilityToFormatted)
      .populate({ path: "service", model: "Service" });

    const unavailableSlots = records.map((record) => {
      let duration = record.service.duration / 1000 / 60;
      let startTimes = new Date(record.startTime)
        .toISOString()
        .split(".")[0]
        .slice(0, -3);

      return {
        from: startTimes,
        duration: duration,
      };
    });

    res.json(unavailableSlots);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Не удалось загрузить unavailable time slots " });
  }
};
