import { catchAsyncError } from "../../utils/catchAsyncError.js";
import { AppError } from "../../utils/AppError.js";
import { deleteOne } from "../../handlers/factor.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";
import { reviewModel } from "./../../../Database/models/review.js";

const addReview = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
    req.body.userId = req.user._id;
    req.body.productId = id; // Ensure productId is set

    let isReviewed = await reviewModel.findOne({
        userId: req.user._id,
        productId: id,
    });

    if (isReviewed) {
        return next(new AppError("You created a review before", 409));
    }

    const addReview = new reviewModel(req.body);
    await addReview.save();

    res.status(201).json({ message: "success", addReview });
});

const getAllReviews = catchAsyncError(async (req, res, next) => {
  let apiFeature = new ApiFeatures(reviewModel.find(), req.query)
    .pagination()
    .fields()
    .filteration()
    .search()
    .sort();
  const PAGE_NUMBER = apiFeature.queryString.page * 1 || 1;
  const getAllReviews = await apiFeature.mongooseQuery;
  res
    .status(201)
    .json({ page: PAGE_NUMBER, message: "success", getAllReviews });
});

const getSpecificReview = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  let result = await reviewModel.findById(id).populate('comments');

  if (!result) {
    return next(new AppError("Review was not found", 404));
  }

  res.status(200).json({ message: "success", result });
});

const updateReview = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  console.log({ user: req.user._id });
  const updateReview = await reviewModel.findOneAndUpdate(
    { _id: id, userId: req.user._id },
    req.body,
    {
      new: true,
    }
  );

  console.log(updateReview);

  updateReview && res.status(201).json({ message: "success", updateReview });

  !updateReview &&
    next(
      new AppError(
        "Review was not found or you're not authorized to review this project",
        404
      )
    );
});

const deleteReview = deleteOne(reviewModel, "Review");
export {
  addReview,
  getAllReviews,
  getSpecificReview,
  updateReview,
  deleteReview,
};
