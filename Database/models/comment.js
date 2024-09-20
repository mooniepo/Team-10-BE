import { Schema, model } from "mongoose";

const commentSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    isLiked:{
      type:Boolean,
      default:false
     },
    userId: {
      type: Schema.ObjectId,
      ref: "user",
      required: true,
    },
    reviewId: {
        type: Schema.ObjectId,
        ref: "review",
        required: true,
      }
  },
  { timestamps: true }
);

export const commentModel = model("comment", commentSchema);
