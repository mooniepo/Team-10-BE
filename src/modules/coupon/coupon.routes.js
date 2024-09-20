import express from "express";
import * as coupon from "./coupon.controller.js";
import { validate } from "../../middlewares/validate.js";
import {
  createCouponValidation,
  deleteCouponValidation,
  updateCouponValidation,
  updateSpecificCoupon
} from "./coupon.validation.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";

const couponRouter = express.Router();

couponRouter
  .route("/")
  .post(
    protectedRoutes,
    allowedTo("user", "admin"),
    validate(createCouponValidation),
    coupon.createCoupon
  )
  .get(
    protectedRoutes,
    allowedTo("user"),
    coupon.getSpecificCoupon
  )
  
  .put(
    protectedRoutes,
    allowedTo("admin", "user"),
    validate(updateSpecificCoupon),
    coupon.updateSpecificCoupon
  );
  

couponRouter
  .route("/:id")
  .put(
    protectedRoutes,
    allowedTo("admin", "user"),
    validate(updateCouponValidation),
    coupon.updateCoupon
  )
  .delete(
    protectedRoutes,
    allowedTo("user", "admin"),
    validate(deleteCouponValidation),
    coupon.deleteCoupon
  );

export default couponRouter;
