const express = require('express');
const router = express.Router();
const redis = require('redis');
const bluebird = require('bluebird');

bluebird.promisifyAll(redis);
const client = redis.createClient({'db': 0});
/* GET Quotes API. */

router.post('', async function(req, res){
    res.locals.title = 'AnimeQuotes';
    let anime = req.body.anime;
    let char = req.body.char;
    let quote = req.body.quote;
    let episode = req.body.episode;
    let submitter = req.body.submitter;
    if (!(anime && char && quote && episode && submitter)) {
        res.status(400).json({'status': 400, 'error': 'Invalid Request'})
    }
    try {
        const submitted_quotes = await client.incrAsync('submitted_quotes');
        await client.hmsetAsync('pending:' + submitted_quotes, [
            'id', submitted_quotes,
            'anime', anime,
            'char', char,
            'quote', quote,
            'episode', episode,
            'submitter', submitter
        ]);
        res.status(200).json({'status': 200});
    } catch (err) {
        console.log(err);
        res.status(500).json({'status': 500, 'error': 'Internal Server Error'});
    }
});

module.exports = router;
