var express = require('express');
var cors = require('cors');

var app = express();

app.use(cors({ origin: 'http://localhost:4200' }));

app.listen(3000, () => console.log("Server started on port 3000"));