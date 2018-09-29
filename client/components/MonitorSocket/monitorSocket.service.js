'use strict';

import * as _ from 'lodash';
import angular from 'angular';
import io from 'socket.io-client';



function MonitorSocket(socketFactory,$rootScope,$notification) {
  'ngInject';
  // socket.io now auto-configures its connection when we ommit a connection url

  var ioSocket = io(  );
  var audio = new Audio('/api/video/music/playMusic');
    audio.loop = true;
  var inHold= false;
  var socket = socketFactory({
    ioSocket
  });
  var notification = $notification;


  return {
    socket,
    unsyncUpdates(modelName) {
       socket.removeAllListeners();
      socket.removeAllListeners(`${modelName}:remove`);
    },
    removeAll() {
       socket.removeAllListeners();
    }
  };
}

export default angular.module('ngWebsocketApp.monitorSocket', [])
  .factory('monitorSocket', MonitorSocket)
  .name;
