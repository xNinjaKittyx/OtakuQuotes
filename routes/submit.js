const express = require('express');
const router = express.Router();
const redis = require('redis');
const bluebird = require('bluebird');
const request = require('request');

bluebird.promisifyAll(redis);
const db = require('../db');
/* GET Quotes API. */

router.post('', async function(req, res){
    if (
        req.body.captcha === undefined ||
        req.body.captcha === '' ||
        req.body.captcha === null
    ) {
        console.log('No Captcha Found');
        return res.status(400).json({'status': 400, 'success': false, 'message': 'No Captcha Was Found.'});
    }
    const secret_key = process.env.CAPTCHA_SECRET;

    const verify_url = `https://google.com/recaptcha/api/siteverify`;
    const captcha_body = {
        "secret": secret_key,
        "response": req.body.captcha,
        "remoteip": req.connection.remoteAddress
    };
    request.post({url: verify_url, form: captcha_body}, async (err, response, body) => {
        if (err) {
            console.log(err);
            return res.status(500).json({'status': 500, 'success': false, 'message': 'ReCaptcha Returned Error'})
        }
        body = JSON.parse(body);

        // if not successful
        if(body.success !== undefined && !body.success) {
            console.log('Body was not successful ' + body.success);
            res.status(400).json({'status': 400, 'success': false, 'message': 'Failed Captcha'});
            return
        } else if(body.success === undefined){
            console.log('Body returned success undefined. ' + body);
            res.status(400).json({'status': 400, 'success': false, 'message': 'Failed Captcha'});
            return
        }

        res.locals.title = 'AnimeQuotes';
        let anime = req.body.anime.replace(/[^\x00-\x7F]/g, "");
        let char = req.body.char.replace(/[^\x00-\x7F]/g, "");
        let quote = req.body.quote.replace(/[^\x00-\x7F]/g, "");
        let episode = req.body.episode.replace(/[^\x00-\x7F]/g, "");
        let submitter = req.body.submitter.replace(/[^\x00-\x7F]/g, "");
        if (!(anime && char && quote && episode && submitter)) {
            res.status(400).json({'status': 400, 'success': false, 'error': 'Invalid Request. Please note that we do not accept non-ascii characters at the moment.'});
            return
        }
        if (anime)
        try {
            await db.query(
                'INSERT INTO otakuquotes.pending (quote_text, char_name, anime_name, episode, submitter_name, time_stamp) ' +
                'VALUES ($1, $2, $3, $4, $5, $6)', [quote, char, anime, episode, submitter, '00:00:00']);
            res.status(200).json({'status': 200, 'success': true, 'message': 'Quote Submitted! Thanks for submitting!'});
        } catch (err) {
            console.log(err);
            res.status(500).json({'status': 500, 'success': false, 'error': 'Internal Server Error'});
        }
    })



});

module.exports = router;
