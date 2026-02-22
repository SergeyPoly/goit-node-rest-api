import Contact from "../models/Contact.js";

export const listContacts = async (ownerId, query = {}) => {
  const { page = 1, limit = 20, favorite } = query;
  const offset = (page - 1) * limit;

  const where = { owner: ownerId };
  if (favorite !== undefined) {
    where.favorite = favorite;
  }

  return await Contact.findAll({
    where,
    limit: Number(limit),
    offset: Number(offset),
  });
};

export const getContactById = (id, ownerId) =>
  Contact.findOne({ where: { id, owner: ownerId } });

export const removeContact = async (contactId, ownerId) => {
  const contact = await Contact.findOne({ where: { id: contactId, owner: ownerId } });
  if (!contact) return null;

  await contact.destroy();
  return contact;
};

export const addContact = (data, ownerId) =>
  Contact.create({ ...data, owner: ownerId });

export const updateContact = async (contactId, ownerId, data) => {
  const contact = await Contact.findOne({ where: { id: contactId, owner: ownerId } });
  if (!contact) return null;

  return await contact.update(data);
};

export const updateStatusContact = (contactId, ownerId, favorite) => {
  return updateContact(contactId, ownerId, { favorite });
};
