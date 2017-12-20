const express = require('express');
const router = express.Router();
const redis = require('redis');
const random = require('random-js');
const bluebird = require('bluebird');

bluebird.promisifyAll(redis);
const engine = random.engines.mt19937().autoSeed();
const client = redis.createClient('6379', process.argv[process.argv.length-1], {'db': 0});

router.get('', async function(req, res, next) {
    res.locals.title = 'AnimeQuotes';
    try {
        const quote_count = await client.getAsync('quotecount');
        const quote = await client.hgetallAsync('quote:' + random.integer(1, quote_count)(engine));

        res.json({'quotes' : quote});
    } catch (err) {
        console.log(err);
        res.status(500).json({'status': 500, 'error': 'Internal Server Error'});
    }
});

module.exports = router;