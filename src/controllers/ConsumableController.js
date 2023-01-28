import ConsumableSchema from "../models/Consumable.js";

export const create = async (req, res) => {
  try {
    const { name, units, amount, totalCost } = req.body;
    const price = totalCost / amount;
    const doc = new ConsumableSchema({ name, units, amount, totalCost, price });
    const consumable = await doc.save();

    res.json(consumable);
  } catch (error) {
    console.error(error);
    alert("Не вдалось створити розхідник");
  }
};

export const getAllConsumable = async (req, res) => {
  try {
    const consumables = await ConsumableSchema.find();

    res.status(200).json(consumables);
  } catch (error) {
    console.error(error);
    alert("Не вдалось отримати розхідники з серверу");
  }
};

export const deleteConsumable = async (req, res) => {
  try {
    const consumableId = req.params.id;

    await ConsumableSchema.findByIdAndRemove({ _id: consumableId });

    res.status(200).json({ message: "success" });
  } catch (error) {
    console.error(error);
    alert("Не вдалось delete розхідники");
  }
};
