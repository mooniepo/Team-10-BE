import { globalErrorHandling } from "./middlewares/GlobalErrorHandling.js";
import addressRouter from "./modules/address/address.routes.js";
import authRouter from "./modules/auth/auth.routes.js";
import couponRouter from "./modules/coupon/coupon.routes.js";
import orderRouter from "./modules/order/order.routes.js";
import productRouter from "./modules/product/product.routes.js";
import reviewRouter from "./modules/review/review.routes.js";
import cartRouter from "./modules/cart/cart.routes.js";
import userRouter from "./modules/user/user.routes.js";
import brandRouter from "./modules/brand/brand.routes.js";
import commentRouter from "./modules/comment/comment.routes.js";
import { AppError } from "./utils/AppError.js";

export function bootstrap(app) {
  app.use("/team10/api/products", productRouter);
  app.use("/team10/api/brands", brandRouter);
  app.use("/team10/api/users", userRouter);
  app.use("/team10/api/auth", authRouter);
  app.use("/team10/api/review", reviewRouter);
  app.use("/team10/api/address", addressRouter);
  app.use("/team10/api/coupons", couponRouter);
  app.use("/team10/api/carts", cartRouter);
  app.use("/team10/api/orders", orderRouter);
  app.use("/team10/api/comments", commentRouter);

  app.all("*", (req, res, next) => {
    next(new AppError("Endpoint was not found", 404));
  });

  app.use(globalErrorHandling);
}
