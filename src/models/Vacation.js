import mongoose, { Schema, model } from "mongoose";

const VacationSchema = new Schema({
  from: {
    type: String,
    required: true,
  },
  to: { type: String, required: true },
});

export default model("Vacation", VacationSchema);
