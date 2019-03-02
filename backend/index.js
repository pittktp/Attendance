var express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const { mongoose } = require('./db.js');

var app = express();

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(bodyParser.json());

app.listen(3000, () => console.log("Server started on port 3000"));

var studentController = require('./controllers/StudentController.js');
var courseController = require('./controllers/CourseController.js');
app.use('/api/students', studentController);
app.use('/api/courses', courseController);
