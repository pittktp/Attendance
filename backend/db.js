const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017/Attendence';

mongoose.connect(url, { useNewUrlParser: true}, (err) => {
  if(err) {
    console.error('Error connecting to MongoDB Server: ', err);
  } else {
    console.log('Connection to MongoDB Server Successful!');
  }
});

module.exports = mongoose;