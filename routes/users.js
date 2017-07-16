var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send({
      'anime': 'Fate/Stay Night',
      'character': 'Emiya Shirou',
      'quote': 'People die when they are killed'
  });
});

module.exports = router;
