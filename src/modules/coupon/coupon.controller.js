import { catchAsyncError } from "../../utils/catchAsyncError.js";
import { AppError } from "../../utils/AppError.js";
import { deleteOne } from "../../handlers/factor.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";
import { couponModel } from "../../../Database/models/poin.js";


const createCoupon = catchAsyncError(async (req, res, next) => {
  req.body.userId = req.user._id;
  const createCoupon = new couponModel(req.body);
  await createCoupon.save();

  res.status(201).json({ message: "success", createCoupon });
});

const getAllCoupons = catchAsyncError(async (req, res, next) => {
  let apiFeature = new ApiFeatures(couponModel.find(), req.query)
    .pagination()
    .fields()
    .filteration()
    .search()
    .sort();
  const PAGE_NUMBER = apiFeature.queryString.page * 1 || 1;
  const getAllCoupons = await apiFeature.mongooseQuery;

  res
    .status(201)
    .json({ page: PAGE_NUMBER, message: "success", getAllCoupons });
});
const getSpecificCoupon = catchAsyncError(async (req, res, next) => {
  console.log(req.user._id);

  let poin = await couponModel.findOne({ userId: req.user._id });

  !poin && next(new AppError("point was not found", 404));
  poin && res.status(200).json({ message: "success", poin });
});

const updateCoupon = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const updateCoupon = await couponModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  updateCoupon && res.status(201).json({ message: "success", updateCoupon });

  !updateCoupon && next(new AppError("Coupon was not found", 404));
});

const deleteCoupon = deleteOne(couponModel, "Coupon");

const updateSpecificCoupon = catchAsyncError(async (req, res, next) => {
  console.log({ user: req.user._id });
  const userCoupon = await couponModel.findOneAndUpdate(
    { userId: req.user._id },
    req.body,
    {
      new: true,
    }
  );

  console.log(userCoupon);

  userCoupon && res.status(201).json({ message: "success", userCoupon });

  !userCoupon &&
    next(
      new AppError(
        "coupon was not found or you're not authorized to review this project",
        404
      )
    );
});


export {
  createCoupon,
  getAllCoupons,
  getSpecificCoupon,
  updateCoupon,
  deleteCoupon,
  updateSpecificCoupon
};
