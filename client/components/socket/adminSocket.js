'use strict';

import * as _ from 'lodash';
import angular from 'angular';
import io from 'socket.io-client';



function Socket(socketFactory,$rootScope,$notification,Auth) {
  'ngInject';
    var socket;
    
  var audio = new Audio('/api/video/music/playMusic');
    audio.loop = true;
  var inHold= false; 
    
var ioSocket = io('', {'query': {token:Auth.getToken()},
                       forceNew: false
                      });
  var socket = socketFactory({
    ioSocket
  }); 
    var notification = $notification;
      socket.emit('users:getUsers');    
  return { 
    socket,
    ioSocket,
    socketReconnect(token){
    socket.connect('', {
    'query': {token: token},
    forceNew: false 
    });  
    },
    syncUsers(testStack,array, cb) {
      cb = cb || angular.noop;
      socket.on('users:reUsers',(allUser)=>{
        testStack.pop();
        testStack.push(allUser); 
          cb(testStack, array);
      });
      socket.on(`users:connected`, function(item) {
          console.log(item);
        var oldItem = _.find(array, {
          id: item.id
        });
        var index = array.indexOf(oldItem);
        var event = 'connected';
        if(oldItem) {
          array.splice(index, 1, item);
          event = 'updated';
        } else {
          array.push(item);
        }
        cb(testStack, array);
      });
    },
    sendCommand(message) {
        console.log(message);
        let event= message.event;
        let data= message.data;
      socket.emit(event,data);
    },
    unsyncAll() {
      socket.removeAllListeners();
    }, 
    disconnectCurrent() {
      socket.disconnect();
    
    }, 
    connectCurrent() {
        socket.reconnect();
     //return socket.disconnect();
    }
  };
}

export default angular.module('ngWebsocketApp.adminSocket', [])
  .factory('adminSocket', Socket)
  .name;
