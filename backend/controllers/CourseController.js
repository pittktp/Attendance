const express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;

var { Course } = require('../models/Course');

router.get('/', (req, res) => {

  Course.find((err, docs) => {
    if(!err) {
      res.send(docs);
    }
    else
      console.log('Error in Retriving Courses: ' + JSON.stringify(err, undefined, 2));
  });
});

router.get('/:id', (req, res) => {

  // Not a valid ID
  if(!ObjectId.isValid(req.params.id))
    return res.status(404).send('No record with given id: ' + req.params.id);

  // Finds a request by ID
  Course.findById(req.params.id, (err, doc) => {
    if(!err)
      res.send(doc);
    else
      console.log('Error in Retriving Courses: ' + JSON.stringify(err, undefined, 2));
  });
});

router.post('/', (req, res) => {

  // Creates new request obj
  var course = new Course({
    name: req.body.name,
    students: req.body.students
  });

  // Saves the request obj to DB
  course.save((err, doc) =>{
    if(!err)
      res.send(doc);
    else {
      console.log('Error in Course POST: ' + JSON.stringify(err, undefined, 2));
    }
  });
});

router.put('/:id', (req, res) => {

  // Checks if object is in DB -> if not, can't update it so send back 404 NOT FOUND error
  if(!ObjectId.isValid(req.params.id))
    return res.status(404).send('No record with given id: ' + req.params.id);

  // Create new request obj
  var course = {
    name: req.body.name,
    students: req.body.students
  };

  // Finds the request in the DB by ID and replaces it with the new request obj we just made
  Course.findByIdAndUpdate(req.params.id, { $set: course }, { new: true }, (err, doc) => {
    if(!err)
      res.send(doc);
    else
      console.log('Error in Course UPDATE: ' + JSON.stringify(err, undefined, 2));
  });
});

router.delete('/:id', (req, res) => {

  // Looks for this request in the DB -> if not found, send back a 404 NOT FOUND error
  if(!ObjectId.isValid(req.params.id))
    return res.status(400).send('No record with given id: ' + req.params.id);

  // Finds the request in DB by ID and deletes it
  Course.findByIdAndRemove(req.params.id, (err, doc) => {
    if(!err)
      res.send(doc);
    else
      console.log('Error in Course DELETE: ' + JSON.stringify(err, undefined, 2));
  });
});

module.exports = router;
