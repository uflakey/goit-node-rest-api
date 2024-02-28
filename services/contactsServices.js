const fs = require("fs/promises");
const path = require("path");
const contactsPath = path.join(__dirname, "contacts.json");
const shortid = require("shortid");

async function listContacts() {
  const list = await fs.readFile(contactsPath);
  return JSON.parse(list);
}

async function getContactById(contactId) {
  const contacts = await listContacts();
  const getContact = contacts.find((contact) => contact.id === contactId);
  return getContact || null;
}

async function removeContact(contactId) {
  const contacts = await listContacts();
  const remove = contacts.findIndex((item) => item.id === contactId);
  if (remove === -1) {
    return null;
  }
  const del = contacts.splice(remove, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return del;
}

async function addContact(name, email, phone) {
  const contacts = await listContacts();
  const newContact = {
    name,
    email,
    phone,
    id: shortid.generate(),
  };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
