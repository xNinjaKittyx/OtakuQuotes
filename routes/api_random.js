var express = require('express');
var router = express.Router();
var redis = require('redis');
var random = require('random-js');

var engine = random.engines.mt19937().autoSeed();
client = redis.createClient({'db': 3})
/* GET Quotes API. */
router.get('/', function(req, res, next) {
    var quote = {};
    client.get('quotecount', function(err, reply) {
        if(err) {
            console.log(err);
            res.status(500).json({'error': 'Internal Server Error'});
        }
        client.hgetall('quote:' +
            random.integer(1, reply)(engine),
            function(err, reply) {
                if(err){
                    console.log(err);
                    res.status(500).json({'error': 'Internal Server Error'});
                }
                else {
                    res.json({'quotes' : reply});
                }
            });
    });
});

module.exports = router;
