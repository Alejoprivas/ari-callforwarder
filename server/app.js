/**
 * Main application file
 */

'use strict';

import express from 'express';
import mongoose from 'mongoose';
mongoose.Promise = require('bluebird');
import config from './config/environment';
import eventServ from './listeners/eventServ';
import http from 'http';
import seedDatabaseIfNeeded from './config/seed';

import Videos from './api/videos/videos.model';
import Condominio from '../server/api/condominio/condominio.model'
import User from '../server/api/user/user.model'

import alarmEvent from '../server/api/alarmEvent/alarmEvent.model';
import alarmConfig from '../server/api/alarmConfig/alarmConfig.model';

// Connect to MongoDB
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function(err) {
  console.error(`MongoDB connection error: ${err}`);
  process.exit(-1); // eslint-disable-line no-process-exi t
});

//let ari = require('ari-client');
let util = require('util');
let _ = require('lodash');
let path = require('path');
let fs = require('fs');
let ffmpeg = require('fluent-ffmpeg'); 
let Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;
let gfs = new Grid(mongoose.connection.db);    
var request = require('request');
let app = express(); 

let allCallers =[];

//let server = http.createServer(app);
let server;

server = require('http').createServer(app);
require('./config/express').default(app);
require('./routes').default(app);

// Start server
function startServer() {
  app.angularFullstack = server.listen(config.port, config.ip, function() {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  });
} 
var socketio = require('socket.io')(server); 
require('./config/socketio').default(socketio);
 
let moment = require('moment');

const awry = require('awry');
const myevents = awry.Events.connect({
  app: 'channel-dump2',
  url: 'http://200.29.150.213:8088/ari/events',
  username: 'assterisk',
  password: 'd19acd60852ec61de93b60a496a14aa0'
});
myevents.on('message', message => {
  console.log(message);
});

// ensure endpoint was passed in to script
/// ari/ari_websockets.c:126 ast_ari_websocket_session_read: WebSocket read error: Connection reset by peer



setImmediate(startServer);


/*javascript parser
request('http://sa.hik-online.com/impmitani', function (error, response, body) {
  if (!error && response.statusCode == 200) {
      
    let indexEnd=(myBody)=>{
    let startStr="redirectUrl =  'http://"; 
    let indexStart= body.indexOf(startStr)+startStr.length;
    let final= myBody.substr(indexStart,body.length);
    let ip = final.substr(0,final.indexOf(":"));
        return ip;
    };

  }
})
  /*
exports = module.exports = app;
/*
{"idAlarma":"8200","nombre":"PRUEBAS MODULO ETHERNETJR","empresa":"ALARMATIC","telefono":"800710710","evento":{"eventodesc":"Panico","eventoHora":"17:56:08","eventoFecha":"19/12/2017"}}
*/

/*
let myMailListener = require('./listeners/myMailListener');
*/