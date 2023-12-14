const asyncHandler = require("express-async-handler"); // is used to handle all the async exceptions
const Contact = require("../modals/contactModal");

// @desc get all contacts
// @route GET /api/contacts
// @access private
const getContacts = asyncHandler(async (req, res) => {
  let contacts = await Contact.find({ user_id: req.user.id });
  res.status(200).json(contacts);
});

// @desc create new contacts
// @route POST /api/contacts
// @access private
const createContact = asyncHandler(async (req, res) => {
  console.log("Request body", req.body);
  const { name, email, phone, company } = req.body;
  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const contact = await Contact.create({
    name,
    email,
    phone,
    company,
    user_id: req.user.id,
  });
  res.status(201).json(contact);
});

// @desc update contact
// @route PUT /api/contacts/:id
// @access private
const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }

  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User not authorized");
  }

  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );
  res.status(200).json(updatedContact);
});

// @desc delete contact
// @route DELETE /api/contacts/:id
// @access private
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }

  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User not authorized");
  }

  await Contact.deleteOne({ _id: req.params.id });
  res.status(200).json(contact);
});

// @desc get single contacts
// @route GET /api/contacts/:id
// @access private
const getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  res.status(200).json(contact);
});

module.exports = {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
  getContact,
};
