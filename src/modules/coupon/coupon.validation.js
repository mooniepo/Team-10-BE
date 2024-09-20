import Joi from "joi";

const createCouponValidation = Joi.object({
  poin: Joi.number().required().min(0),
});

const updateCouponValidation = Joi.object({
  id: Joi.required(),
  poin: Joi.number().min(0),
});

const deleteCouponValidation = Joi.object({
  id: Joi.required(),
});

const updateSpecificCoupon= Joi.object({
  poin: Joi.number().required().min(0),
});

export {
  createCouponValidation,
  updateCouponValidation,
  deleteCouponValidation,
  updateSpecificCoupon
};
