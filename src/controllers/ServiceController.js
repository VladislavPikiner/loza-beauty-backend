import ServiceSchema from "../models/Service.js";
import { getAvailabilities } from "@tspvivek/sscheduler";

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
    console.log(unavailable);
    const availabilityFrom = new Date();
    const availabilityTo = new Date(
      availabilityFrom.setDate(availabilityFrom.getDate() + 30)
    );

    const availableTime = getAvailabilities({
      from: new Date().toISOString().split("T")[0],
      to: availabilityTo.toISOString().split("T")[0],
      timezone: "EET",
      duration: duration,
      interval: 30,
      normalize: true,
      schedule: {
        weekdays: {
          from: "08:00",
          to: "20:30",
          // unavailability: [
          //   { from: "00:00", to: "08:00" },
          // ],
        },
        Saturday: { from: "08:00", to: "20:30" },
        Sunday: { from: "08:00", to: "20:30" },
        unavailability: vacations,
        allocated: unavailable,
      },
    });

    const findAvailableSlots = Object.entries(availableTime).filter(
      ([key, value]) => {
        if (key === date) {
          return value;
        }
      }
    );
    const availableSlots = findAvailableSlots[0][1];

    res.status(200).json(availableSlots);
  } catch (error) {
    res.status(500).json({ message: "Не удалось getAvailability" });
  }
};
