var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
res.render('index', { title: 'AnimeQuotes',
    description: 'A RESTFUL API to grab your favorite quotes.'});
});

module.exports = router;
