// Represents a request object in our database

const mongoose = require('mongoose');

var Course = mongoose.model('Course', {
  name: { type: String },
  students: { type: Array }
});

module.exports = { Course };
