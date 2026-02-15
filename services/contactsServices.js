import Contact from "../models/Contact.js";

export const listContacts = () => Contact.findAll();

export const getContactById = (contactId) => Contact.findByPk(contactId);

export const removeContact = async (contactId) => {
  const contact = await Contact.findByPk(contactId);
  if (!contact) return null;

  await contact.destroy();
  return contact;
};

export const addContact = (data) => Contact.create(data);

export const updateContact = async (contactId, data) => {
  const contact = await Contact.findByPk(contactId);
  if (!contact) return null;

  return await contact.update(data);
};

export const updateStatusContact = (contactId, favorite) => {
  return updateContact(contactId, { favorite });
};
