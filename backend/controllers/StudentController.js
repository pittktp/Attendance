const express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;

var { Student } = require('../models/Student');

var lastScannedRFID = -1;

router.get('/', (req, res) => {

  // Gets all members in DB and sends them as a list called docs
  Student.find((err, docs) => {
    if(!err) {
      res.send(docs);
    }
    else
      console.log('Error in Retriving Students for auth: ' + JSON.stringify(err, undefined, 2));
  });

});

// Track rfid
router.post('/rfid', (req, res) => {
  lastScannedRFID = req.body.RFID;

  // Search for user with matching RFID, if found return name w/ code 200, else code 201
  Student.findOne({rfid: lastScannedRFID}, (err, doc) => {
    if(!err) {
      res.status(200).send(doc.name);
    } else {
      res.status(201).send();
    }
  });  
})

router.get('/rfid', (req, res) => {  
  if(lastScannedRFID == -1) {
    console.error('Invalid RFID value of: ', lastScannedRFID);
    res.status(404).send();
  } else {
    return res.status(200).send({rfid: lastScannedRFID});
  }
});

router.get('/:id', (req, res) => {

    // Not a valid ID
    if(!ObjectId.isValid(req.params.id))
      return res.status(404).send('No record with given id: ' + req.params.id);

    Student.findById(req.params.id, (err, doc) => {
      if(!err) {
        return res.send(doc);
      }
      else {
        console.log('Error in Retriving Student: ' + JSON.stringify(err, undefined, 2));
      }
    });

});

router.post('/', (req, res) => {
    if(lastScannedRFID != -1) {
      var student = new Student({
        name: req.body.name,
        email: req.body.email,
        rfid: lastScannedRFID
      });

      //Actually saves to the DB
      student.save((err, doc) =>{
        if(!err)
          res.send(doc);
        else {
          console.log('Error in Student POST: ' + JSON.stringify(err, undefined, 2));
        }
      });

      // After saving student with last scanned RFID to DB, reset lastScannedRFID to -1
      lastScannedRFID = -1;
    } else {
      console.error('Invalid RFID value of: ', lastScannedRFID);
    }
});

router.put('/:id', (req, res) => {
  var admin = false;

  // Check if member is already in the DB -> if not, send back 404 NOT FOUND error
  if(!ObjectId.isValid(req.params.id))
    return res.status(404).send('No record with given id: ' + req.params.id);

  // Create a new member object to represent the updated member
  var student = new Student({
    name: req.body.name,
    email: req.body.email,
    rfid: lastScannedRFID
  });

  // Finds the member in the DB and updates him/her with the newly created member obj
  Student.findByIdAndUpdate(req.params.id, { $set: student }, { new: true }, (err, doc) => {
    if(!err)
      res.send(doc);
    else
      console.log('Error in Student UPDATE: ' + JSON.stringify(err, undefined, 2));
  });
});

// DELETE Member --> localhost:3000/member/*id-number*
// PROTECTED endpoint
router.delete('/:id', (req, res) => {

  // Looks for this member in the DB -> if not found send back 404 NOT FOUND error
  if(!ObjectId.isValid(req.params.id))
    return res.status(400).send('No record with given id: ' + req.params.id);

  // Finds the member in the DB and deletes him/her
  Student.findByIdAndRemove(req.params.id, (err, doc) => {
    if(!err)
      res.send(doc);
    else
      console.log('Error in Student DELETE: ' + JSON.stringify(err, undefined, 2));
  });
});

module.exports = router;