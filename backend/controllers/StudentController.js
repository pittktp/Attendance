const express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;

var { Student } = require('../models/Student');
var { Course } = require('../models/Course');

var lastScannedRFID = -1;
var isTakingAttendance = false;
var takeAttendanceList = [];
var courseToTakeAttendance = '';
var studentsHere = [];

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

router.post('/rfid', (req, res) => {
  if(isTakingAttendance) {
    Course.find((err, docs) => {
      if(!err) {
        Course.find((err, docs) => {
          if(!err) {
            //console.log(docs)
            var courses = docs
            for(var i = 0; i < courses.length; i++){
               if(courses[i].name == courseToTakeAttendance) {
                 var course = courses[i];
                 for(var j = 0; j < course.students.length; j++) {
                   if(req.body.RFID == course.students[j].rfid) {
                      takeAttendanceList.push(course.students[j]);
                      console.log(course.students[j])
                    }
                 }
               }
             }
          }
          else
            console.log('Error in Retriving Courses: ' + JSON.stringify(err, undefined, 2));
        });
      }
      else
        console.log('Error in Retriving Courses: ' + JSON.stringify(err, undefined, 2));
    });
  }

  else {
    lastScannedRFID = req.body.RFID;
  }

  return res.status(200).send();

});

router.get('/rfid', (req, res) => {
  if(lastScannedRFID == -1) {
    console.error('Invalid RFID value of: ', lastScannedRFID);
    res.status(404).send();
  } else {
    return res.status(200).send({rfid: lastScannedRFID});
  }
});

router.post('/take-attendance', (req, res) => {
    console.log("taking attendance...")
    courseToTakeAttendance = req.body.course;
    isTakingAttendance = true;

    return res.status(200).send();
});

router.post('/stop-attendance', (req, res) => {
    console.log("stopping taking attendance...")
    isTakingAttendance = false;

    Student.find((err, docs) => {
      if(!err) {
        for(var i = 0; i < docs.length; i++) {
          for(var j = 0; j < takeAttendanceList.length; j++) {
            if(docs[i].rfid == takeAttendanceList[j].rfid) {
              studentsHere.push(docs[i].name);
              break;
            }
          }
        }
      }
      else
        console.log('Error in Retriving Students for auth: ' + JSON.stringify(err, undefined, 2));

      var ret = studentsHere;
      studentsHere = [];

      return res.send(ret);
    });

    // for(var i = 0; i < takeAttendanceList.length; i++) {
    //   var query = { 'rfid' : takeAttendanceList[i].rfid };
    //   Student.findOne(query, function(err, item) {
    //     if(!item) { }
    //
    //     else {
    //       console.log(item.name);
    //       studentsHere.push(item.name);
    //       //return res.send(studentsHere);
    //     }
    //
    //   });
    // }
    // return res.send(studentsHere);

    //return res.send(studentsHere);
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

    console.log(lastScannedRFID);
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
