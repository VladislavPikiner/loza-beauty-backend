import ServiceSchema from "../models/Service.js";

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
