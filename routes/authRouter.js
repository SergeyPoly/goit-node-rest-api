import express from "express";
import * as authControllers from "../controllers/authControllers.js";
import validateBody from "../middlewares/validateBody.js";
import authenticate from "../middlewares/authenticate.js";
import {
  registerSchema,
  loginSchema,
  updateSubscriptionSchema,
} from "../schemas/userSchemas.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerSchema), authControllers.register);
authRouter.post("/login", validateBody(loginSchema), authControllers.login);

authRouter.post("/logout", authenticate, authControllers.logout);
authRouter.get("/current", authenticate, authControllers.getCurrent);
authRouter.patch(
  "/subscription",
  authenticate,
  validateBody(updateSubscriptionSchema),
  authControllers.updateSubscription,
);

export default authRouter;
