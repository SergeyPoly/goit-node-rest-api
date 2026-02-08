import express from "express";

import {
  getAllContacts,
  getContact,
  createContact,
  deleteContact,
  updateContactById,
} from "../controllers/contactsControllers.js";

import validateBody from "../helpers/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

const router = express.Router();

router.get("/", getAllContacts);
router.get("/:id", getContact);

router.post("/", validateBody(createContactSchema), createContact);

router.delete("/:id", deleteContact);

router.put("/:id", validateBody(updateContactSchema), updateContactById);

export default router;
