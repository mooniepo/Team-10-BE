import Joi from "joi";

const addCommentValidation = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

const getSpecificCommentValidation = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

const updateCommentValidation = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

const deleteCommentValidation = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

export {
  addCommentValidation,
  getSpecificCommentValidation,
  updateCommentValidation,
  deleteCommentValidation,
};
