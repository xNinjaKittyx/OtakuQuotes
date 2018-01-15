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
            const { rows } = await db.query(
                'SELECT quotes.quote_id, quotes.quote_text, quotes.date_added, quotes.episode, ' +
                'quotes.time_stamp, quotes.submitter_name, ' +
                'characters.char_name, characters.image, anime.anime_name ' +
                'FROM otakuquotes.quotes ' +
                'LEFT JOIN otakuquotes.characters ON quotes.char_id = characters.char_id ' +
                'LEFT JOIN otakuquotes.anime ON characters.anime_id = anime.anime_id ' +
                'WHERE quotes.quote_id = $1', [random_id]);
            const quote = rows[0];
            result.quotes = {
                'quote_id': quote['quote_id'],
                'quote': quote['quote_text'],
                'anime': quote['anime_name'],
                'char': quote['char_name'],
                'episode': quote['episode'],
                'timestamp': quote['time_stamp'],
                'date_added': quote['date_added'],
                'submitter': quote['submitter_name'],
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