import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema({
  star: {
    type: Number,
  },
  message: {
    type: String,
    require: true,
  },
  contact: {
    type: String,
  },
});

export default mongoose.model("Feedback", FeedbackSchema);
