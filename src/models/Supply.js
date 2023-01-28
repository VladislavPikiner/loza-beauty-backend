import mongoose, { Schema, model } from "mongoose";

const SupplySchema = new Schema(
  {
    consumable: { type: mongoose.Types.ObjectId, ref: "Consumable" },
    amount: {
      type: Number,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Supply", SupplySchema);
