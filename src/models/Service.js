import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  durationView: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
  price: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },

  consumable: [
    {
      consumableId: { type: mongoose.Types.ObjectId, ref: "Consumable" },
      amount: Number,
    },
  ],
});

export default mongoose.model("Service", ServiceSchema);
