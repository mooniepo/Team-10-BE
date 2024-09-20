import { Schema, model } from "mongoose";

const brandSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    userId: {
      type: Schema.ObjectId,
      ref: "user",
      required: true,
    }
  },
  { timestamps: true }
);

export const brandModel = model("brand", brandSchema);
