/**
 * Socket.io configuration
 */
'use strict';

// import config from './environment';

// When the user disconnects.. perform this


import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import User from '../api/user/user.model';
import Controlador from '../api/controlador/controlador.model';
import config from './environment';

import Reporte from '../api/reporte/reporte.model';

var  ariClient	= require('../listeners/socketBus');
 

var register = new ariClient.socketBus("socketio");

// When the user connects.. perform this
function onConnect(socket) {
  // When the client emits 'info', this listens and executes
    console.log('onconnect')
  socket.on('info', data => {
    socket.log(JSON.stringify(data, null, 2));
  });
    
  // Insert sockets below
  require('../api/reporte/reporte.socket').register(socket);
  require('../api/apertura/apertura.socket').register(socket);
  require('../api/controlador/controlador.socket').register(socket);
  //require('../api/alarmConfig/alarmConfig.socket').register(socket);
  //require('../api/alarmEvent/alarmEvent.socket').register(socket);
  require('../api/thing/thing.socket').register(socket);
    
}

function onDisconnect(socket) {
    register.removeAllListeners();
}

export default function(socketio) {
socketio.set('heartbeat timeout', 4000); 
socketio.set('heartbeat interval', 2000);

socketio.use(function(socket, next){
    if (socket.handshake.query && socket.handshake.query.token){  
    jwt.verify(socket.handshake.query.token, config.secrets.session, function(err, decoded) {
      if(err){
          socket.disconnect();
          return next(new Error('Authentication error'))
      }; 
    socket.decoded = decoded;
    socket.decoded.ip =socket.handshake.address;
    socket.decoded.sid =socket.id;
if(decoded._id && decoded.role){
User.findById(decoded._id).exec()
        .then(user => {
          if(!user) {
            socket.disconnect();
          }
        //next();
        })
        .catch(err => next(err));       
} 
if(decoded._id && decoded.Condominio){
    
Controlador.findById(decoded._id).exec()
        .then(cont => {
          if(!cont) {
            socket.disconnect();
          }
        //next();
        })
        .catch(err => next(err));      
} 
     
        
      next();
    });
        
        
  } else {
      next(new Error('Authentication error'));
  }    
});     


 
    
socketio.on('connection', function(socket) {

    register.on(`hangUp`,(data)=>{
        console.log('hangup')
        socket.emit(`${data}:hangUp`,"bye")
    })    
    socket.on(`lastWill`,(data) => {
        console.log("lastWill")
        updateReporte(data[0].idReporte,data[0]);
        //register.emit('updateReporte',data);
  });
    socket.address = `${socket.request.connection.remoteAddress}:${socket.request.connection.remotePort}`;

    socket.connectedAt = new Date();
    socket.log = function(...data) {
      console.log(`SocketIO  ${socket.nsp.name} [${socket.address}]`, ...data);
    };
    socket.on('confirmar',(data)=>{
        //console.log('confirmar');
        register.sendDtmf(data);
    })
    socket.on('forceCall',(data)=>{
        //console.log('confirmar');
        register.forceCall(data);
    })
      var interval = setInterval(()=>{  

          
        let usersOn=Object.keys(socketio.sockets.sockets);
        let myUsers = usersOn.map(function(e) {
            
    return socketio.sockets.sockets[e].decoded;
        })           
          //console.log(myUsers)
        
      socket.emit('callStack',register.holdStack);
      socket.emit('users:reUsers',myUsers);
      }, 1000);
  
    socket.on('disconnect', () => {
      onDisconnect(socket);
      socket.log('DISCONNECTED');
    });


    socket.on('answer', (data) => {
        //console.log('originate');
        //console.log(data);
        register.startOriginate(data)
    });
    socket.on('hangUp', (data) => {
    
        register.forceHangup(data);
    });
    
    register.on('ChannelEnteredMixingBridge',(callThis)=>{
        console.log("enteredMixingbridge");
        socket.emit(`${callThis.dialed}:answer`,callThis);
    })
    
    socket.on('users:getUsers', () => {
        let usersOn=Object.keys(socketio.sockets.sockets);
        let myUsers = usersOn.map(function(e) {
    return socketio.sockets.sockets[e].decoded;
        })        
      socket.emit('users:reUsers',myUsers);
    });
    // Call onConnect.
    onConnect(socket);
    socket.log('CONNECTED');
  });
}
    function updateReporte(idReporte,myReporte){
         const fields = ['visitante', 
                         'observacion', 
                         'operador', 
                         'responsable',  
                         'tags',  
                         'joinedHoldingBridge',
                         'leftHoldingBridge',
                         'joinedMixingBridge',
                         'leftMixingBridge',
                         'endStasis',
                         'dialed'];

 
        try{
            Reporte.findById(idReporte, function (err, doc) {
            if (err) return console.log(err);
                fields.forEach((field)=>{
                  if(myReporte[field]){
                      doc.set(field,myReporte[field])
                  }
                
            })
                  doc.save(function (err, updatedDoc) {
                      console.log("socketio");
                  });
                });       
        }catch(e){
            console.log(e)
        }
        
  }
 