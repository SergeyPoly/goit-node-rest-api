import express from "express";
import {
  getAllContacts,
  getContact,
  createContact,
  deleteContact,
  updateContactById,
  updateStatusContact,
} from "../controllers/contactsControllers.js";
import validateBody from "../middlewares/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from "../schemas/contactsSchemas.js";
import authenticate from "../middlewares/authenticate.js";

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", getAllContacts);
contactsRouter.get("/:id", getContact);
contactsRouter.post("/", validateBody(createContactSchema), createContact);
contactsRouter.delete("/:id", deleteContact);
contactsRouter.put("/:id", validateBody(updateContactSchema), updateContactById);
contactsRouter.patch("/:id/favorite", validateBody(updateFavoriteSchema), updateStatusContact);

export default contactsRouter;
