import ConsumableSchema from "../models/Consumable.js";
import SupplySchema from "../models/Supply.js";

export const create = async (req, res) => {
  try {
    const { consumable, amount, totalCost } = req.body;

    const countConsumable = await ConsumableSchema.findByIdAndUpdate(
      { _id: consumable },
      { $inc: { amount: amount, totalCost: totalCost } }
    ).exec();

    if (countConsumable) {
      const doc = new SupplySchema({
        consumable,
        amount,
        cost: totalCost,
      });
      const supply = await doc.save();

      res.status(200).json(supply);
    } else res.status(500).json({ message: "Не удалось создать поступление" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Не удалось создать поступление" });
  }
};

export const getAllSupply = async (req, res) => {
  try {
    const supply = await SupplySchema.find()
      .populate({ path: "consumable", model: "Consumable" })
      .exec();

    res.status(200).json(supply);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Не удалось загрузить поступления" });
  }
};

export const deleteSupply = async (req, res) => {
  const recordId = req.params.id;
  try {
    await SupplySchema.findByIdAndDelete({ _id: recordId });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Не удалось удалить запись" });
  }
};
