import mongoose, { Schema, model } from "mongoose";

const RecordSchema = new Schema(
  {
    service: { type: mongoose.Types.ObjectId, ref: "Service" },
    clientName: {
      type: String,
      required: false,
    },
    clientPhone: {
      type: Number,
      required: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: false,
    },
    complete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Record", RecordSchema);
