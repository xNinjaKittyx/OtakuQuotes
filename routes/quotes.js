var express = require('express');
var router = express.Router();

/* GET Quotes API. */
router.get('/', function(req, res, next) {
    if(!req.query.tags){
        res.send({});
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
