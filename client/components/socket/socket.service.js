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
    answerPhone(callers,number){
    callers.soporte = number;
      socket.emit('answer',callers);

    },     
    confirmar(responsable){ 
      socket.emit('confirmar',responsable );  
    },        
    forceCall(){ 
      socket.emit('forceCall','asdad' );  
    },   
    activarRele(data){
      this.socket.emit(`broadcast`,data); 
    },
    syncCallStack(array,testStack,cb){
          cb = cb || angular.noop;
      socket.on('HoldingBridge:remove', function(item) {
        var event = 'deleted';
        _.remove(array, {
          number: item.number
        });
          if(item.length ==0){
              audio.pause();
          }
        cb(item, array) ;
      });
        socket.on('HoldingBridge:add', function(item) {
        var oldItem = _.find(array, {
          number: item.number
        });     var index = array.indexOf(oldItem);
        if(!oldItem) {
        array.push(item);
        }           
            cb(item, array);
      })
        socket.on('newCall',function(item){
                    
    notification('Llamada entrante', {
  body: `condominio: ${item}`,
  dir: 'auto',
  lang: 'es',
  delay: 5000, // in ms
  focusWindowOnClick: true // focus the window on click
})
        })
        socket.on('callStack', function(item) { 
        if(item.length>0 && !inHold){
           audio.play();
           }
        if(item.length==0 ){
           audio.pause();
        }
            testStack.pop();
            testStack.push(item);
            
            cb(item, testStack);
      })
    },    syncSoporte(extension,array,totalItems,ipStream,cb){

          cb = cb || angular.noop;
      socket.on(`${extension}:hangUp`, function(item) {
          console.log(item)
          console.log('bye')
            inHold = false;
          socket.emit(`lastWill`,array)
            ipStream.pop();
            array.pop();
            totalItems.pop();
        cb(item, array);
      });
        socket.on(`${extension}:answer`, function(item) {
            inHold = true; 
             audio.pause();
        var oldItem = _.find(array, {
          _id: item._id
        });     
        var index = array.indexOf(oldItem);
        if(!oldItem) {
        item.operador=Auth.getCurrentUserSync()._id;
        array.push(item);  
        totalItems.push(item.condo.residentes.length);
        } 
        cb(item, array,totalItems,cb);
      })
    },sendDtmf(){
      socket.emit('sendDtmf','0000*');    
    }, hangUp(done){
      socket.emit('hangUp',done);    
    },
    removeAll() {
       socket.removeAllListeners();
    },
    syncUpdates(modelName, array, cb) {
      cb = cb || angular.noop;
      /**
       * Syncs item creation/updates on 'model:save'
       */
      socket.on(`${modelName}:save`, function(item) {
          
        var oldItem = _.find(array, {
          _id: item._id
        });
        var index = array.indexOf(oldItem);
        var event = 'created';
        // replace oldItem if it exists
        // otherwise just add item to the collection
        if(oldItem) {
          array.splice(index, 1, item);
          event = 'updated';
        } else {
          array.push(item);
        }

        cb(event, item, array);
      });

      /**
       * Syncs removed items on 'model:remove'
       */
      socket.on(`${modelName}:remove`, function(item) {
        var event = 'deleted';
        _.remove(array, {
          _id: item._id
        });
        cb(event, item, array);
      });
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

export default angular.module('ngWebsocketApp.socket', [])
  .factory('socket', Socket)
  .name;
