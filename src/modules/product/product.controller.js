import slugify from "slugify";
import { catchAsyncError } from "../../utils/catchAsyncError.js";
import { AppError } from "../../utils/AppError.js";
import { deleteOne } from "../../handlers/factor.js";
import { productModel } from "./../../../Database/models/product.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";

const addProduct = catchAsyncError(async (req, res, next) => {
  req.body.userId = req.user._id;

  // Check if files exist before accessing them
  if (req.files && req.files.imgCover && req.files.imgCover[0]) {
    req.body.imgCover = req.files.imgCover[0].filename;
  } else {
    return res.status(400).json({ error: "imgCover file is missing" });
  }

  if (req.files && req.files.images && req.files.images.length > 0) {
    req.body.images = req.files.images.map((ele) => ele.filename);
  } else {
    return res.status(400).json({ error: "Images are missing" });
  }

  req.body.slug = slugify(req.body.title);
  const addProduct = new productModel(req.body);
  await addProduct.save();

  res.status(201).json({ message: "success", addProduct });
});

const getAllProducts = catchAsyncError(async (req, res, next) => {
  let apiFeature = new ApiFeatures(productModel.find(), req.query)
    .pagination()
    .fields()
    .filteration()
    .search()
    .sort();
  const PAGE_NUMBER = apiFeature.queryString.page * 1 || 1;
  const getAllProducts = await apiFeature.mongooseQuery;

  res
    .status(201)
    .json({ page: PAGE_NUMBER, message: "success", getAllProducts });
});
const getSpecificProduct = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  // Use findById and populate the reviews virtual field
  const getSpecificProduct = await productModel.findById(id).populate('reviews');

  if (!getSpecificProduct) {
    return next(new AppError("Product not found", 404));
  }

  res.status(200).json({ message: "success", getSpecificProduct });
});

const updateProduct = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }
  const updateProduct = await productModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  updateProduct && res.status(201).json({ message: "success", updateProduct });

  !updateProduct && next(new AppError("Product was not found", 404));
});

const deleteProduct = deleteOne(productModel, "Product");
export {
  addProduct,
  getAllProducts,
  getSpecificProduct,
  updateProduct,
  deleteProduct,
};
