'use strict';

var express = require('express');
var controller = require('./alarmEvent.controller');

var router = express.Router();

router.get('/', controller.index);
router.post('/query', controller.filter);
router.get('/phantom', controller.phantoms);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.upsert);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);

module.exports = router;
