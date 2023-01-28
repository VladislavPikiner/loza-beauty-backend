import mongoose from "mongoose";

const ConsumableSchema = new mongoose.Schema({
  name: String,
  units: String,
  amount: Number,
  totalCost: Number,
  price: Number,
});

export default mongoose.model("Consumable", ConsumableSchema);
