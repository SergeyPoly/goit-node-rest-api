import Joi from "joi";

export const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "Missing required email field",
    "string.email": "Invalid email format",
  }),
  password: Joi.string().min(6).required().messages({
    "any.required": "Missing required password field",
    "string.min": "Password must be at least 6 characters long",
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const updateSubscriptionSchema = Joi.object({
  subscription: Joi.string()
    .valid("starter", "pro", "business")
    .required()
    .messages({
      "any.only": "Subscription must be one of ['starter', 'pro', 'business']",
    }),
});
