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
    } = req.body;
    const doc = new ServiceSchema({
      name,
      duration,
      address,
      durationView,
      description,
      available,
      price,
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
    const services = await ServiceSchema.find();

    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Не удалось получить процедуры" });
  }
};

export const availableSwitcher = async (req, res) => {
  const { name } = req.body;
  try {
    await ServiceSchema.updateOne(
      {
        name: name,
      },
      { $set: { available: !true } }
    );

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Не удалось изменить процедуру" });
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
    const { duration, unavailable, date } = req.body;

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
        // unavailability: [
        //   { from: "2017-02-20T00:00", to: "2017-02-27T00:00" },
        // ], second syntax for unavailable
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
