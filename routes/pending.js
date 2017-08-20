const express = require('express');
const router = express.Router();
const redis = require('redis');
const bluebird = require('bluebird');

bluebird.promisifyAll(redis);
const client = redis.createClient({'db': 0});

function scanAsync(cursor, pattern, returnSet, count){

    return client.scanAsync(cursor, "MATCH", pattern, "COUNT", "100").then(
        function (reply) {

            cursor = reply[0];
            let keys = reply[1];
            keys.every(function(key,i){
                returnSet.add(key);
                return !(count && (returnSet.size >= count))
            });

            if( cursor === '0' || (count && (returnSet.size >= count))) {
                return Array.from(returnSet);
            }
            else{
                return scanAsync(cursor, pattern, returnSet)
            }


        });
}

router.get('', function(req, res) {
    res.locals.title = 'AnimeQuotes';
    let dem_keys = new Set();
    let results = 10;
    if (req.query.maxResults) {
        results = req.query.maxResults;
    }
    let result = {'status': 200, 'quotes': []};
    scanAsync('0', 'pending:*', dem_keys, results).then(
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
                res.status(200).json(result);
            }, function(err) {
                console.log(err);
                res.status(500).json({'status': 500, 'error': 'Internal Server Error'});
            });
        }
    );
});

module.exports = router;