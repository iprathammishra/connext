import mongoose from "mongoose";
const { Schema } = mongoose;

const meetingSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  urgency: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  time: {
    type: Date,
    required: true,
  },
  platform: {
    type: String,
    enum: ["meets", "teams", "zoom", "cisco", "other"],
    required: true,
  },
});

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: false,
    },
    meetings: [meetingSchema],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
