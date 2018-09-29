'use strict';

var express = require('express');
var controller = require('./videos.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/getMeta', controller.index);
router.post('/query', controller.filter);
router.get('/:id', controller.playVid);
router.get('/music/playMusic', controller.playMusic);
router.get('/play/:id', controller.read);
router.post('/', controller.create);
router.post('/upload', controller.upload);
router.put('/:id', controller.upsert);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);

module.exports = router;
