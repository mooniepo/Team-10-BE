import { Schema, model } from "mongoose";

const couponSchema = new Schema(
  {
    poin: {
      type: Number,
      required: true,
      min: 0,
    },
    userId: {
      type: Schema.ObjectId,
      ref: "user",
      required: true,
    }
  },
  { timestamps: true }
);


export const couponModel = model("coupon", couponSchema);
