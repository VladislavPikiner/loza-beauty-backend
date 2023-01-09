import mongoose, { Schema } from "mongoose";
import RecordSchema from "../models/Record.js";
import ServiceSchema from "../models/Service.js";

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

export const getRecordsOnDate = async (req, res) => {
  try {
    const { currentDate } = req.body;

    const allRecordsOnDate = await RecordSchema.find({
      startDate: currentDate,
    }).populate({ path: "service", model: "Service" });

    res.json(allRecordsOnDate);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Не удалось загрузить записи на выбранную дату " });
  }
};
