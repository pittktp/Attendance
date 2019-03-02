const mongoose = require('mongoose');

// For local database
//const url = 'mongodb://localhost:27017/Attendence';

// For local database
const url = "mongodb://database:27017/KtpDB";

mongoose.connect(url, { useNewUrlParser: true}, (err) => {
  if(err) {
    console.error('Error connecting to MongoDB Server: ', err);
  } else {
    console.log('Connection to MongoDB Server Successful!');
  }
});

module.exports = mongoose;
