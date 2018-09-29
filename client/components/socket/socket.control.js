'use strict';

import * as _ from 'lodash';
import angular from 'angular';
import io from 'socket.io-client';



function socketController(socketFactory,Auth,socket) {
  'ngInject';
var socket = socket;
    socket.emit('users:getUsers');    
  return { 
    socket,
    activarRele(data){
        console.log(data);
      this.socket.emit(`broadcast`,data); 
      //this.socket.emit(`broadcast`,{pin:data.pin,id:pin.id}); 
    },   
    syncExtension(extension){ 
      socket.forward(`${extension}:answer`)
      socket.forward(`${extension}:hangUp`)
    },
    removeAll() {
       socket.removeAllListeners();
    },
    disconnectCurrent() {
      socket.disconnect();
    
    }
  };
}

export default angular.module('ngWebsocketApp.socketController', [])
  .factory('socketController', socketController)
  .name;
