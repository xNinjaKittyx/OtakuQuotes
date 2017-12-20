const express = require('express');
const router = express.Router();
const redis = require('redis');
const Promise = require('bluebird');
Promise.promisifyAll(redis);

const client = redis.createClient('6379', 'redis-server', {'db': 0});

async function scanAsyncTags(cursor, pattern, returnSet, count, tags){
    // tags must be in ARRAY format.
    const reply = await client.scanAsync(cursor, "MATCH", pattern, "COUNT", "100");
    const new_cursor = reply[0];
    const keys = reply[1];
    const commands = [];
    for (let key of keys) {
        commands.push(client.hgetallAsync(key))
    }
    const quotes = await Promise.all(commands);

    for (let quote of quotes) {
        if (tags.length === 0) {
            returnSet.add(quote);
        } else {
            for (let tag of tags) {
                if (quote.anime.toLowerCase().indexOf(tag.toLowerCase()) >= 0 ||
                    quote.char.toLowerCase().indexOf(tag.toLowerCase()) >= 0 ||
                    quote.quote.toLowerCase().indexOf(tag.toLowerCase()) >= 0) {
                    returnSet.add(quote);
                }
            }
        }
        if (returnSet.size >= count) {
            return Array.from(returnSet)
        }
    }

    if (new_cursor === '0' || cursor === 0 || (count && (returnSet.size >= count))) {
        return Array.from(returnSet);
    }
    else {
        return await scanAsyncTags(new_cursor, pattern, returnSet, count, tags)
    }
}

router.param('id', async function(req, res, next, id)  {
    try {
        let result = {'status': 200, 'quote': null};
        result.quote = await client.hgetallAsync('quote:' + id);
        res.status(200).json(result)
    } catch (err) {
        next();
    }
});

router.get('/:id', async function(req, res, next) {
    console.log('Calling router.get');
    next();
});

router.get('', async function(req, res, next) {
    res.locals.title = 'AnimeQuotes';

    let quotes = new Set();
    let results = 25;
    if(req.query.limit){
        results = req.query.limit;
    }
    let tags = [];
    if(req.query.tags){
        tags = req.query.tags.split(' ');
    }

    let result = {'status': 200, 'quotes': []};
    try {
        result.quotes = await scanAsyncTags('0', 'quote:*', quotes, results, tags);
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