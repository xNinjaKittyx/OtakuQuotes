const express = require('express');
const router = express.Router();
const redis = require('redis');
const random = require('random-js');
const bluebird = require('bluebird');

bluebird.promisifyAll(redis);
const engine = random.engines.mt19937().autoSeed();
const client = redis.createClient({'db': 0});

router.get('', function(req, res, next) {
    res.locals.title = 'AnimeQuotes';
    client.get('quotecount', function(err, reply) {
        if(err) {
            console.log(err);
            res.status(500).json({'status': 500, 'error': 'Internal Server Error'});
        }
        client.hgetall('quote:' +
            random.integer(1, reply)(engine),
            function(err, reply) {
                if(err){
                    console.log(err);
                    res.status(500).json({'status': 500, 'error': 'Internal Server Error'});
                }
                else {
                    res.json({'quotes' : reply});
                }
            });
    });
});

module.exports = router;