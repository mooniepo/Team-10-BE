import express from "express";
import * as review from "./review.controller.js";
import { validate } from "../../middlewares/validate.js";

import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import {
  deleteReviewValidation,
  getSpecificReviewValidation,
  updateReviewValidation,
} from "./review.validation.js";

const reviewRouter = express.Router();

reviewRouter
  .route("/")
  .get(review.getAllReviews);

reviewRouter
  .route("/:id")
  .put(
    protectedRoutes,
    allowedTo("user"),
    validate(updateReviewValidation),
    review.updateReview
  )
  .get(validate(getSpecificReviewValidation), review.getSpecificReview)
  .delete(
    protectedRoutes,
    allowedTo("admin", "user"),
    validate(deleteReviewValidation),
    review.deleteReview
  )
  .post(
    protectedRoutes,
    allowedTo("user"),
    review.addReview
  );

export default reviewRouter;
