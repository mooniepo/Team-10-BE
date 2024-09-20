import { Schema, model } from "mongoose";

const reviewSchema = new Schema(
  {
    text: {
      type: String,
      trim: true,
      required: true,
    },
    productId: {
      type: Schema.ObjectId,
      ref: "product",
      required: true,
    },
    userId: {
      type: Schema.ObjectId,
      ref: "user",
      required: true,
    },
    rate: {
      type: Number,
      default: 1,
    },
    likes: {
      type: Number,
      default: 0,
    },
    commentsCount: { // Renamed to avoid conflict with virtual field
      type: Number,
      default: 0,
    }
  },
  { timestamps: true, toJSON: { virtuals: true },toObject: { virtuals: true } }
);

// Define the virtual field for comments
reviewSchema.virtual('comments', {
  ref: 'comment',
  localField: '_id',
  foreignField: 'reviewId',
});

// Pre middleware to populate userId and comments
reviewSchema.pre(['find', 'findOne'], function() {
  this.populate('userId', 'name -_id').populate('comments');
});

export const reviewModel = model("review", reviewSchema);
