var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.status(200).send("Server is up and running.")
});

module.exports = router;