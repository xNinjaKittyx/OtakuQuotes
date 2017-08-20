const express = require('express');
const router = express.Router();
const redis = require('redis');
const bluebird = require('bluebird');
bluebird.promisifyAll(redis);

const client = redis.createClient({'db': 0});

function scanAsyncTags(cursor, pattern, returnSet, count, tags){
    // tags must be in ARRAY format.
    return client.scanAsync(cursor, "MATCH", pattern, "COUNT", "100").then(
        function (reply) {

            cursor = reply[0];
            let keys = reply[1];
            let commands = [];

            keys.forEach(function(key, i) {
                commands.push(client.hgetallAsync(key));
            });
            console.log(commands);
            bluebird.all(commands).then(function(quotes) {
                console.log(quotes);
                for (let i = 0; i < quotes.length; i++) {
                    if (quotes[i].anime.indexOf(tag) >= 0 || quotes[i].char.indexOf(tag) >= 0 || quotes[i].quote.indexOf(tag) >= 0) {
                        console.log('This quote worked:');
                        console.log(quotes[i]);
                        returnSet.add(quotes[i]);
                    }

                }
            });
        }).then(
            function() {
                if (cursor === '0' || (count && (returnSet.size >= count))) {
                    return Array.from(returnSet);
                }
                else {
                    return scanAsyncTags(cursor, pattern, returnSet, count, tags)
                }
            }
        )
}

router.get('', function(req, res, next) {
    res.locals.title = 'AnimeQuotes';

    let quotes = new Set();
    let results = 25;
    if(req.query.maxResults){
        results = req.query.maxResults;
    }
    let tags;
    if(!req.query.tags){
        res.status(400).json({'status': 400, 'error': 'No tags were given.'})
        return
    }
    else {
        tags = req.query.tags.split('%20')
    }
    let result = {'status': 200, 'quotes': []};
    scanAsyncTags('0', 'quote:*', quotes, results, tags)
        .then(function(){
            console.log('parsing quotes');
            console.log(quotes);
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
            res.status(200).json(result);
        }, function(err) {
            console.log(err);
            res.status(500).json({'status': 500, 'error': 'Internal Server Error'});
        });
});


module.exports = router;