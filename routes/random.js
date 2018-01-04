const express = require('express');
const router = express.Router();
const redis = require('redis');
const random = require('random-js');
const bluebird = require('bluebird');

bluebird.promisifyAll(redis);
const engine = random.engines.mt19937().autoSeed();
const redis_client = redis.createClient(process.env.REDIS_URL);
const db = require('../db');

router.get('', async function(req, res, next) {
    res.locals.title = 'AnimeQuotes';
    try {
        let result = {'quotes': null};
        let quote_count = await redis_client.getAsync('quotecount');
        if (quote_count === null) {
            const { rows } = await db.query('SELECT max(quote_id) FROM quotes');

            console.log(rows);
            quote_count = rows[0]['max'];
            await redis_client.setAsync('quotecount', quote_count, 'EX', '150')
        }
        const random_id = random.integer(1, quote_count)(engine);
        result.quotes = await redis_client.getAsync('quote_id:' + random_id);
        if (result.quotes === null) {
            const { rows } = await db.query('SELECT * FROM quotes WHERE quote_id = $1', [random_id]);
            const quote = rows[0];
            result.quotes = {
                'quote_id': quote['quote_id'],
                'quote': quote['quote_content'],
                'anime': quote['anime_name'],
                'char': quote['character_name'],
                'episode': quote['episode'],
                'submitter': quote['submitter'],
                'image': quote['image']
            };
            redis_client.set('quote_id:' + random_id, JSON.stringify(result.quotes), 'EX', '300')
        } else {
            result.quotes = JSON.parse(result.quotes)
        }

        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({'status': 500, 'error': 'Internal Server Error'});
    }
});

module.exports = router;