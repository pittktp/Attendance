var express = require('express');
var cors = require('cors');

var app = express();

app.use(cors({ origin: '' }));

app.listen(3000, () => console.log("Server started on port 3000"));