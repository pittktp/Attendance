// Represents a member object in our database

const mongoose = require('mongoose');

var Student = mongoose.model('Student', {
  name: { type: String },
  email: { type: String},
  rfid: { type: String }
});

module.exports = { Student };
