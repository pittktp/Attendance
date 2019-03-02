const express = require('express');
var router = express.Router();

var mostRecentRfid = -1;

router.post('/', (req, res) => {
  mostRecentRfid = req.body.rfid;
  return res.status(200).send();
});

router.get('/', (req, res) => {
  return res.status(200).send({"RFID": mostRecentRfid});
});

module.exports = router;
