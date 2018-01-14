const express = require('express');
const router = express.Router();
const redis = require('redis');
const Promise = require('bluebird');
Promise.promisifyAll(redis);

const redis_client = redis.createClient(process.env.REDIS_URL);
const db = require('../db');

router.param('id', async function(req, res, next, id)  {
    try {
        let result = {'status': 200, 'quotes': null};
        result.quotes = await redis_client.getAsync('quote_id:' + id);
        if (result.quotes === null) {
            const { rows } = await db.query(
                'SELECT quotes.quote_id, quotes.quote_text, quotes.date_added, ' +
                'quotes.episode, quotes.time_stamp, quotes.submitter_name, ' +
                'characters.char_name, characters.image, anime.anime_name' +
                'FROM quotes ' +
                'LEFT JOIN characters ON quotes.char_id = characters.char_id' +
                'LEFT JOIN anime ON characters.anime_id = anime.anime_id' +
                'WHERE quotes.quote_id = $1', [id]);
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
            redis_client.set('quote_id:' + id, JSON.stringify(result.quotes), 'EX', '300');
        }
        else {
            result.quotes = JSON.parse(result.quotes)
        }
        res.status(200).json(result)
    } catch (err) {
        console.log(err);
        res.status(500).json({'status': 500, 'error': 'Internal Server Error'});
    }
});

router.get('/:id', async function(req, res, next) {
    next();
});

router.get('', async function(req, res, next) {
    res.locals.title = 'AnimeQuotes';

    let results = 25;
    if(req.query.limit){
        results = Math.min(req.query.limit, 100);
    }
    let tags = '';
    if(req.query.tags){
        // This is a placeholder for now. in the future, we need a much more robust search.
        tags = req.query.tags;
    }

    let result = {'status': 200, 'quotes': []};
    try {
        const { rows } = await db.query(
            'SELECT quotes.quote_id, quotes.quote_text, ' +
            'characters.char_name, anime.anime_name' +
            'FROM quotes ' +
            'LEFT JOIN characters ON quotes.char_id = characters.char_id' +
            'LEFT JOIN anime ON characters.anime_id = anime.anime_id' +
            'WHERE quotes.quote_text ILIKE $1 OR anime.anime_name ILIKE $1 OR characters.char_name ILIKE ' +
            'LIMIT $2', ['%' + tags + '%', results]);
        for (let item of rows) {
            let some_item = {
                'quote_id': item['quote_id'],
                'quote': item['quote_text'],
                'anime': item['anime_name'],
                'char': item['char_name'],
            };
            result.quotes.push(some_item)

        }
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

    } catch (err) {
        console.log(err);
        res.status(500).json({'status': 500, 'error': 'Internal Server Error'});
    }
});


module.exports = router;