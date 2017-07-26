var express = require('express');
var router = express.Router();
var redis = require('redis');
var redisScan = require('redisscan');
var random = require('random-js');
var bluebird = require('bluebird');

bluebird.promisifyAll(redis);
var engine = random.engines.mt19937().autoSeed();
client = redis.createClient({'db': 0});
/* GET Quotes API. */

router.get('/quotes', function(req, res, next) {
    res.locals.title = 'AnimeQuotes';
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
    res.locals.title = 'AnimeQuotes';
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
    res.locals.title = 'AnimeQuotes';
    var anime = req.body.anime;
    var char = req.body.char;
    var quote = req.body.quote;
    var episode = req.body.episode;
    var submitter = req.body.submitter;
    if (!(anime && char && quote && episode && submitter)) {
        res.status(400).json({'status': 400, 'error': 'Invalid Request'})
    }
    client.incr('submitted_quotes', function(err, reply){
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

function scanAsync(cursor, pattern, returnSet){

    return client.scanAsync(cursor, "MATCH", pattern, "COUNT", "100").then(
        function (reply) {

            cursor = reply[0];
            var keys = reply[1];
            keys.forEach(function(key,i){
                returnSet.add(key);
            });

            if( cursor === '0' ){
                return Array.from(returnSet);
            }else{
                return scanAsync(cursor, pattern, returnSet)
            }

        });
}

router.get('/pending', function(req, res) {
    res.locals.title = 'AnimeQuotes';
    var dem_keys = new Set();
    var count = req.query.count;
    if (count == null) {
        count = 10;
    }
    var result = {'status': 200, 'quotes': []};
    scanAsync('0', 'pending:*', dem_keys).then(
        function(dem_keys){
            bluebird.map(dem_keys, function(result) {
                return client.hgetallAsync(result);
            }).then(function(quotes) {
                result.quotes = quotes;
                result.quotes.sort(function (a, b) {
                    a = Number(a.id);
                    b = Number(b.id);
                    if (a < b)
                        return -1;
                    if (a > b)
                        return 1;
                    return 0
                });
                result.quotes = result.quotes.slice(0, count);
                res.status(200).json(result);
            }, function(err) {
                console.log(err);
                res.status(500).json({'status': 500, 'error': 'Internal Server Error'});
            });
        }
    );
});



module.exports = router;