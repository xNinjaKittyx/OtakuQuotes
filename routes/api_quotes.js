var express = require('express');
var router = express.Router();
var redis = require('redis');


client = redis.createClient({'db': 3})
/* GET Quotes API. */
router.get('/', function(req, res, next) {
    if(!req.query.tags){
        res.status(400).json({ error: 'No tags were given.'});
    }
    else{
        res.send({
            'anime': 'Fate/Stay Night',
            'character': 'Emiya Shirou',
            'quote': 'People die when they are killed'
        });
    }
    n = 25;
    if(req.query.n){
        n = req.query.n;
    }

});

module.exports = router;
