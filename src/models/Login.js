import mongoose from "mongoose";

const LoginSchema = new mongoose.Schema({
  login: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  superAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  token: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Login", LoginSchema);
