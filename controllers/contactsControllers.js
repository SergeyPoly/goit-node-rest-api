import HttpError from "../helpers/HttpError.js";
import {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} from "../services/contactsServices.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (err) {
    next(err);
  }
};

export const getContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await getContactById(id);

    if (!contact) {
      throw HttpError(404, "Not found");
    }

    res.status(200).json(contact);
  } catch (err) {
    next(err);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const removed = await removeContact(id);

    if (!removed) {
      throw HttpError(404, "Not found");
    }

    res.status(200).json(removed);
  } catch (err) {
    next(err);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const newContact = await addContact(name, email, phone);

    res.status(201).json(newContact);
  } catch (err) {
    next(err);
  }
};

export const updateContactById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await updateContact(id, req.body);

    if (!updated) {
      throw HttpError(404, "Not found");
    }

    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};
