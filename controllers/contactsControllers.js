import * as contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const { id: ownerId } = req.user;
    const result = await contactsService.listContacts(ownerId, req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: ownerId } = req.user;

    const result = await contactsService.getContactById(id, ownerId);
    if (!result) throw HttpError(404);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: ownerId } = req.user;

    const result = await contactsService.removeContact(id, ownerId);
    if (!result) throw HttpError(404);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { id: ownerId } = req.user;

    const result = await contactsService.addContact(req.body, ownerId);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateContactById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: ownerId } = req.user;

    const result = await contactsService.updateContact(id, ownerId, req.body);
    if (!result) throw HttpError(404);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: ownerId } = req.user;
    const { favorite } = req.body;

    const result = await contactsService.updateStatusContact(id, ownerId, favorite);
    if (!result) throw HttpError(404);

    res.json(result);
  } catch (error) {
    next(error);
  }
};
