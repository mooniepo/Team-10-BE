import express from "express";
import * as comment from "./comment.controller.js";
import { validate } from "../../middlewares/validate.js";

import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import {
  addCommentValidation,
  getSpecificCommentValidation,
  updateCommentValidation,
  deleteCommentValidation,
  } from "./comment.validation.js";

  const commentRouter = express.Router();


commentRouter
  .route("/:id")
  .put(
    protectedRoutes,
    allowedTo("user"),
    //validate(updateCommentValidation),
    comment.updateComment
  )
  .get(comment.getSpecificComment)
  .delete(
    protectedRoutes,
    allowedTo("admin", "user"),
    //validate(deleteCommentValidation),
    comment.deleteComment
  )
  .post(
    protectedRoutes,
    allowedTo("user"),
    //validate(addCommentValidation),
    comment.addComment
  );

export default commentRouter;
