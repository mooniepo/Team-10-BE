import { catchAsyncError } from "../../utils/catchAsyncError.js";
import { AppError } from "../../utils/AppError.js";
import { commentModel } from "./../../../Database/models/comment.js";
import { deleteOne } from "../../handlers/factor.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";


const getSpecificComment = catchAsyncError(async (req, res, next) => {
    const { id } = req.params; //comment id
    // console.log(id);
  
    let result = await commentModel.findById(id);
  
    !result && next(new AppError("Comment was not found", 404));
    result && res.status(200).json({ message: "success", result });
  });

const addComment = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
      req.body.userId = req.user._id;
      req.body.reviewId = id; // review id
  
      const addComment = new commentModel(req.body);
      await addComment.save();
  
      res.status(201).json({ message: "success", addComment });
  });

const updateComment = catchAsyncError(async (req, res, next) => {
    const { id } = req.params; //comment id
    console.log({ user: req.user._id });
    const updateComment = await commentModel.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      req.body,
      {
        new: true,
      }
    );
  
    console.log(updateComment);
  
    updateComment && res.status(201).json({ message: "success", updateComment});
  
    !updateComment &&
      next(
        new AppError(
          "Comment was not found or you're not authorized to comment this project",
          404
        )
      );
  });

  const deleteComment = deleteOne(commentModel, "comment");

  export {
    addComment,
    getSpecificComment,
    updateComment,
    deleteComment,
  };
  


  