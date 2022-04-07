import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    owner: {
      type: String,
      required: true,
      ref: "User",
    },
    // owner: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'User'
    // },
  },
  {
    timestamps: true,
  }
);

const Notice = mongoose.model("Notice", noticeSchema);
export default Notice;
