const express = require('express');
const router = express.Router();
const redis = require('redis');
const bluebird = require('bluebird');

bluebird.promisifyAll(redis);
const client = redis.createClient({'db': 0});
/* GET Quotes API. */

router.post('', function(req, res){
    res.locals.title = 'AnimeQuotes';
    let anime = req.body.anime;
    let char = req.body.char;
    let quote = req.body.quote;
    let episode = req.body.episode;
    let submitter = req.body.submitter;
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

module.exports = router;
