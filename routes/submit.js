const express = require('express');
const router = express.Router();
const redis = require('redis');
const bluebird = require('bluebird');
const request = require('request');

bluebird.promisifyAll(redis);
const client = redis.createClient(process.env.REDIS_URL);
const db = require('../db');
/* GET Quotes API. */

router.post('', async function(req, res){
    if (
        req.body.captcha === undefined ||
        req.body.captcha === '' ||
        req.body.captcha === null
    ) {
        return res.json({'status': 400, 'success': false, 'message': 'No Captcha Was Found.'});
    }

    const secret_key = process.env.CAPTCHA_SECRET;

    const verify_url = `https://google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`;

    request(verify_url, (err, response, body) => {
        body = JSON.parse(body);

        // if not successful
        if(body.success !== undefined && !body.success){
            return res.json({'status': 400, 'success': false, 'message': 'Failed Captcha'})
        }

        res.locals.title = 'AnimeQuotes';
        let anime = req.body.anime;
        let char = req.body.char;
        let quote = req.body.quote;
        let episode = req.body.episode;
        let submitter = req.body.submitter;
        if (!(anime && char && quote && episode && submitter)) {
            return res.status(400).json({'status': 400, 'error': 'Invalid Request'})
        }
    });

    try {
        await db.query('INSERT INTO pending (quote_content, character_name, anime_name, episode, submitter, image) VALUES ($1, $2, $3, $4, $5, $6)', [quote, char, anime, episode, submitter, 'N/A'])
        res.status(200).json({'status': 200});
    } catch (err) {
        console.log(err);
        res.status(500).json({'status': 500, 'error': 'Internal Server Error'});
    }


});

module.exports = router;
