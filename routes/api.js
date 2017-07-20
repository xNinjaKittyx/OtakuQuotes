var express = require('express');
var router = express.Router();
var redis = require('redis');
var random = require('random-js');
var bluebird = require('bluebird');
var async = require('async');

bluebird.promisifyAll(redis);
var engine = random.engines.mt19937().autoSeed();
client = redis.createClient({'db': 0});
/* GET Quotes API. */

router.get('/quotes', function(req, res, next) {
    if(!req.query.tags){
        res.status(400).json({'status': 400, 'error': 'No tags were given.'});
    }
    else{
        res.json({
            'status': 200,
            'quotes': {
                'anime': 'Fate/Stay Night',
                'character': 'Emiya Shirou',
                'quote': 'People die when they are killed'
            }
        });
    }
    var results = 25;
    if(req.query.n){
        results = req.query.n;
    }

});

router.get('/random', function(req, res, next) {
    var quote = {};
    client.get('quote_count', function(err, reply) {
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

router.post('/submit', function(req, res){
    var anime = req.body.anime;
    var char = req.body.char;
    var quote = req.body.quote;
    var episode = req.body.episode;
    var submitter = req.body.submitter;
    if (!(anime && char && quote && episode && submitter)) {
        res.status(400).json({'status': 400, 'error': 'Invalid Request'})
    }
    client.incr('quotes', function(err, reply){
        if(err) {
            console.log(err);
            res.status(500).json({'status': 500, 'error': 'Internal Server Error'});
            return
        }
        client.hmset('pending:' + reply, [
            'id', reply,
            'anime', anime,
            'char', char,
            'quote', quote,
            'episode', episode,
            'submitter', submitter
        ], function(err, reply) {
            if(err) {
                console.log(err);
                res.status(500).json({'status': 500, 'error': 'Internal Server Error'});
                return
            }
            console.log(reply);
            res.status(200).json({'status': 200});
        });
    });
});

router.get('/pending', function(req, res) {

    var result = {'status': 200, 'quotes': []};
    client.keys('pending:*', function(err, reply){
        if(err) {
            console.log(err);
            res.status(500).json({'status': 500, 'error': 'Internal Server Error'});
        }
        if (reply) {
            bluebird.map(reply, function(result) {
                return client.hgetallAsync(result);
            }).then(function(quotes) {
                result.quotes = quotes;
                res.status(200).json(result);
            }, function(err) {
                console.log(err);
                res.status(500).json({'status': 500, 'error': 'Internal Server Error'});
            });
        }
    });
});



module.exports = router;