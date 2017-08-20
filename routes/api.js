const express = require('express');
const router = express.Router();
const redis = require('redis');
const redisScan = require('redisscan');
const random = require('random-js');
const bluebird = require('bluebird');

bluebird.promisifyAll(redis);
const engine = random.engines.mt19937().autoSeed();
const client = redis.createClient({'db': 0});
/* GET Quotes API. */





module.exports = router;