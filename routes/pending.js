const express = require('express');
const router = express.Router();
const redis = require('redis');
const Promise = require('bluebird');

Promise.promisifyAll(redis);
const client = redis.createClient(process.env.REDIS_URL);

async function scanAsync(cursor, pattern, returnSet, count){
    const reply = await client.scanAsync(cursor, "MATCH", pattern, "COUNT", "100");
    const new_cursor = reply[0];
    const keys = reply[1];
    for (let key of keys) {
        returnSet.add(key);
        if (returnSet.size >= count) {
            break
        }
    }
    if (cursor === '0' || cursor === 0 || returnSet.size >= count) {
        return Array.from(returnSet)
    }
    else {
        return await scanAsync(new_cursor, pattern, returnSet)
    }

}
router.param('id', async function(req, res, next, id)  {
    try {
        let result = {'status': 200, 'quote': null};
        result.quote = await client.hgetallAsync('pending:' + id);
        if (result.quote === null) {
            next();
        }
        else {
            res.status(200).json(result)
        }
    } catch (err) {
        next();
    }
});

router.get('/:id', async function(req, res, next) {
    console.log('Calling router.get');
    next();
});

router.get('', async function(req, res) {
    res.locals.title = 'AnimeQuotes';
    let dem_keys = new Set();
    let results = 10;
    if (req.query.limit) {
        results = req.query.limit;
    }
    let result = {'status': 200, 'quotes': []};

    try {
        dem_keys = await scanAsync('0', 'pending:*', dem_keys, results);
        result.quotes = [];
        for (let dem_key of dem_keys) {
            result.quotes.push(await client.hgetallAsync(dem_key))
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