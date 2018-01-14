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
        result.quotes = await redis_client.getAsync('pending_id:' + id);
        if (result.quotes === null) {
            const { rows } = await db.query(
                "SELECT * FROM pending " +
                "WHERE quotes_id = $1", [id]);
            const quote = rows[0];
            result.quotes = {
                'pending_id': quote['quote_id'],
                'quote': quote['quote_text'],
                'anime': quote['anime_name'],
                'char': quote['char_name'],
                'episode': quote['episode'],
                'timestamp': quote['time_stamp'],
                'submitter': quote['submitter_name'],
                'date_submitted': quote['date_submitted'],
            };
            redis_client.set('pending_id:' + id, JSON.stringify(result.quotes), 'EX', '300');
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

router.get('', async function(req, res) {
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
            "SELECT quotes_id, quote_text, anime_name, char_name " +
            "FROM pending WHERE quote_content " +
            "ILIKE $1 OR anime_name ILIKE $1 OR character_name ILIKE $1 " +
            "LIMIT $2", ['%' + tags + '%', results]);
        for (let item of rows) {
            let some_item = {
                'pending_id': item['quote_id'],
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