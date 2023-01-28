import ServiceSchema from "../models/Service.js";
import { getAvailabilities } from "@tspvivek/sscheduler";
import mongoose from "mongoose";
export const create = async (req, res) => {
  try {
    const {
      name,
      duration,
      durationView,
      description,
      available,
      address,
      price,
      consumable,
    } = req.body;

    const doc = new ServiceSchema({
      name,
      duration,
      address,
      durationView,
      description,
      available,
      price,
      consumable,
    });
    const service = await doc.save();

    res.json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Не удалось создать процедуру" });
  }
};

export const getServices = async (req, res) => {
  try {
    const services = await ServiceSchema.find()
      .populate({
        path: "consumable.consumableId",
        model: "Consumable",
      })
      .exec();
    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Не удалось получить процедуры" });
  }
};

export const deleteService = async (req, res) => {
  const serviceId = req.params.id;
  try {
    await ServiceSchema.findByIdAndDelete({ _id: serviceId });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Не удалось удалить процедуру" });
  }
};

export const getAvailableTime = async (req, res) => {
  try {
    const { duration, unavailable, date, vacations } = req.body;

    const availabilityFrom = new Date();
    const availabilityTo = new Date(
      availabilityFrom.setDate(availabilityFrom.getDate() + 30)
    );

    const availableTime = getAvailabilities({
      from: new Date().toISOString().split("T")[0],
      to: availabilityTo.toISOString().split("T")[0],
      timezone: "EET",
      duration: duration,
      interval: duration,

      schedule: {
        weekdays: {
          from: "08:00",
          to: "20:30",
          // unavailability: [{ from: "12:00", to: "13:00" }], if need rest between records
        },
        Saturday: { from: "08:00", to: "20:30" },
        Sunday: { from: "08:00", to: "20:30" },
        unavailability: vacations, // second syntax for unavailable
        allocated: unavailable,
      },
    }).filter((record) => {
      // return record.from.includes(recordDate.toISOString().split("T")[0]);
      return record.from.includes(date);
    });

    const availableSlots = availableTime.map((time) => {
      return time.from.split("T")[1].slice(0, 5);
    });

    res.status(200).json({ availableSlots });
  } catch (error) {}
};
