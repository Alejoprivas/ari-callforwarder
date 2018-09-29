
const  	events 		= require('events');
const 	util		= require('util'); 
const ari = require('ari-client');

import Condominio from '../api/condominio/condominio.model';
import User from '../api/user/user.model';
import Apertura from '../api/apertura/apertura.model';
import Videos from '../api/videos/videos.model';
import Reporte from '../api/reporte/reporte.model';
// Define Globals
let	TRACE		= true;

// Module Loader
var socketBus = function(options) {
	events.EventEmitter.call(this)
	this.client = this.connect(options)
	this.holdStack = [];
    this.mapStack = [];
	this.mixingBridge = [];
};

util.inherits(socketBus, events.EventEmitter);

socketBus.prototype.connect = function(socket) {
	var self = this;
    var client = ari.connect('http://x.x.x.x:8088', 'user', 'pass',(err,client)=>{
        if (err) {
            console.log(err);
            handleError(self,err); // program will crash if it fails to connect
            
        }

        
    self.myClient= client;

    client.once('StasisStart',()=>{
        console.log('Starting');
        removeBridges(client);
        
    })

    client.on('StasisEnd',(event,channel)=>{
        try{
            if(self.mapStack[event.channel.id]){
            self.mapStack[event.channel.id].endStasis= event.timestamp;
            updateReporte(self.mapStack[event.channel.id].idReporte,self.mapStack[event.channel.id],self);
                console.log('end of stasis');
                delete self.mapStack[event.channel.id];
            }
         }catch(e){
             console.log(e)
         } 
      //safeHangup(channel,self);
    })
        
    client.on('StasisStart', function (event, incoming) {
    let dialed = event.args[0] === 'dialed';
    
    
        
    if (!dialed) {        
     incoming.answer(function (err) {
         
 Condominio.findOne({ extension: incoming.caller.number }).populate({
    path: 'controlador',
  }).
 exec()
        .then(condo => {
          if(!condo) {
              console.log('not found');
            safeHangup(incoming,self)
             // self.emit('destroyChannel',incoming);
        }else{            
            
        self.holdStack.push({
            channelId:incoming.id,
            extension:incoming.caller.number,
            creationtime:incoming.creationtime,
            currentbridge:"",
            condo:condo
        })
        let newKey= incoming.id
        self.mapStack[newKey]={
            channelId:incoming.id,
            currentbridge:"",
            condo:condo,
            joinedHoldingBridge:incoming.creationtime,
            tags:'Sin recibir',
        }
        //console.log(self.mapStack);
            
      getOrCreateBridge(incoming,self);
        }
     
    })
        .catch(err => console.log(err));      

    });
    }
    });
  
    client.start('channel-dump3');
        
    });
    

}

socketBus.prototype.sendDtmf = function (data){
    var self = this;
    //console.log(data)
    self.myClient.channels.sendDTMF({
    channelId: data,dtmf: '0000*'
}).then(()=>{
        console.log('sent');
    })
  .catch(function (err) {
        if(err){
            console.log(err);
        }
    });
}

socketBus.prototype.getHoldingBridge = function () {
var self = this;
    self.myClient.bridges.list()
        .then(function (bridges) {
        self.mybridges = bridges.map((elem)=>{
            return {id:elem.id,
                   channels:elem.channels,
                   type:elem.bridge_type}
        })
    })
    
    return self.mybridges;
}
socketBus.prototype.startOriginate = function (data) {
var self = this
//console.log(self.mapStack)
    self.myClient.bridges.get({bridgeId: self.mapStack[data.channelId].currentbridge}, function (err, bridge) {
        self.myClient.channels.get({channelId: self.mapStack[data.channelId].channelId},(err,channel)=>{
            if(err){
                console.log(err);
            }
            originate(bridge,channel,data.soporte,self)
        })
        
    });

}

socketBus.prototype.forceHangup = function (data) {
var self = this

        self.myClient.channels.get({channelId: data.channelId},(err,channel)=>{
            if(channel){
            console.log("hangup");
            safeHangup(channel,self);
            }
        })
    
}

socketBus.prototype.forceCall = function (extension) {
var self = this



 let myChannel = self.myClient.Channel();
      //console.log('Force originate')

    myChannel.originate(
      {endpoint: `PJSIP/0003`, app: 'channel-dump3'},
      function(err, channel) {
          //console.log('started');
        if (err) {
          console.log(err);
         // console.log('failed at originate')
        }
    });
}


socketBus.prototype.getChannels = function () {
var self = this;
    
 self.myClient.channels.list().then(function (channels) {
    self.channel = channels.map((elem)=>{
        return {id:elem.id,
                caller:elem.caller,
                name:elem.name}
    })
});
    return self.channel;

}
var errHandler = function(err) {
    console.log(err);
}



// Handle connection
function handleConnection(self, options) {
	if (TRACE)	console.log('Connected')
    	//self.socket = socket;
	self.emit("connect");
}

// Handle connection ended
function handleEnd(self) {
	if (TRACE)	console.log("Connection closed!");
	self.emit("end");
}

// Handle Errors
function handleError(self, err) {
	if (TRACE)	console.log("Connection error: " + err);
	self.emit("error", err);
}




//Comienzo de Holding bridge // 
function getOrCreateBridge (channel,self) {
    self.myClient.bridges.list(
        function (err, bridges) {
        
        
      let bridge = bridges.filter(function (candidate) {
        return candidate['bridge_type'] === 'holding' && candidate['name'] === 'porteros'  ;
      })[0];
      if (!bridge) {
          
        bridge = self.myClient.Bridge();
        //console.log(bridge);  
        bridge.create({type: 'holding',name:'porteros'},
            function (err, bridge) {
          bridge.on('ChannelEnteredBridge', function(event, instances) {  
            self.holdStack.forEach(function(element,index) {
              if(element.channelId === event.channel.id){
                  element.currentbridge = event.bridge.id;
                  createReporte(event,self);
              }
                
            });
              self.mapStack[event.channel.id].currentbridge= event.bridge.id;
          });          
         bridge.on('ChannelLeftBridge', function(event, instances) {
             channel.stopMoh(function (err) {
                 if(err){
                 console.log(err)
                 }
             });
             
              if(self.mapStack[event.channel.id]){    
              self.mapStack[event.channel.id].leftHoldingBridge= event.timestamp;
              }
             
             //console.log(event);
            //self.mapStack.add(event.channel.id,{leftBridgeTime:event.timestamp});
             
            let toMixing = self.holdStack.find((element)=>{
                return element.channelId === event.channel.id;    
            }) 
            toMixing.leftBridgeTime = event.timestamp; 
            toMixing.disconnected = ""; 
            toMixing.apertura = {
                observacion:"",
                responsable:"",
                visitante:"",
                receptor:"",
                puerta:"",
                horaDeApertura:""
            }; 
            toMixing.observacion = "";
            self.mixingBridge.push(toMixing); 
            self.holdStack = self.holdStack.filter((element,index)=>{
                return element.channelId !== event.channel.id;
            })
             cleanupBridge(event, instances, bridge,self);
          });
          joinHoldingBridgeAndPlayMoh(bridge, channel,self);
        });
      } else {
          
        joinHoldingBridgeAndPlayMoh(bridge, channel,self);
      }
    });
  }

  function cleanupBridge (event, instances, bridge,self) {
             
    var holdingBridge = instances.bridge;
    if (holdingBridge.channels.length === 0 &&
        holdingBridge.id === bridge.id) {

      bridge.destroy(function (err) {
          if(err){
          console.log(err)
          };
      });
    }
  }
    
  function joinHoldingBridgeAndPlayMoh (bridge, channel,self) {
      
    bridge.addChannel({channel: channel.id}, function (err) {
        if(err){
            console.log(err);
        }
      channel.startMoh(function (err) {console.log(err)});
      //channel.startMoh(function (err) {console.log(err)});
    });
  }

   function safeHangup(channel,self) {
       try{
             channel.hangup(function(err) {
                if(err){
                    console.log('safehangup')
                console.log(err.message);  
                }});
       
       }catch(e){
           
       }

  }

//Finalizacion de bridge
exports.socketBus = socketBus;

////////////////////////////////////////////////////////////////////////////////////////////////////////////
///https://wiki.asterisk.org/wiki/display/AST/ARI+and+Bridges%3A+Bridge+Operations
// handler for client being loaded
 

 
 
  function originate(holdingBridge,channel,receptor,self) {
    let dialed = self.myClient.Channel();
      dialed.on('ChannelDestroyed', function(event, dialed) {
        
      safeHangup(channel,self);
    });
      ///if channel not found ignoreñhfldl
    channel.on('StasisEnd', function(event, channel) {
        
      safeHangup(dialed,self);
    });
      
    dialed.on('StasisStart', function(event, dialed) {
      joinMixingBridge(channel, dialed, holdingBridge,self);
    });
    dialed.originate(
      {endpoint: `PJSIP/${receptor}`,callerId: receptor, app: 'channel-dump3', appArgs: 'dialed'},
      function(err, dialed) {
          //console.log('started');
        if (err) {
          console.log(err);
          //console.log('failed at originate')
        }
    });
  }
 
  // handler for dialed channel entering Stasis
  function joinMixingBridge(channel, dialed, holdingBridge,self) {
    var mixingBridge = self.myClient.Bridge();
    var testBridge = self.myClient.Bridge();
 
    dialed.on('StasisEnd', function(event, dialed) {
      dialedExit(dialed, mixingBridge,self);
    });
 
    dialed.answer(function(err) {
      if (err) {
        console.log(err);
      }
    });
        
    mixingBridge.create({type: 'mixing,proxy_media'}, function(err, mixingBridge) {
      if (err) {
        console.log(err);
      }
 
      console.log('Created mixing bridge %s', mixingBridge.id);
      moveToMixingBridge(channel, dialed, mixingBridge, holdingBridge,self);
    });
         mixingBridge.on('ChannelEnteredBridge',(event,instance)=>{
             if(self.mapStack[event.channel.id]){
             self.mapStack[event.channel.id].joinedMixingBridge= event.timestamp; 
             self.mapStack[event.channel.id].tags= 'Recibido'; 
             }
             
         }) 
         mixingBridge.on('ChannelLeftBridge', function(event, instances) {
            if(self.mapStack[event.channel.id]){    
            self.mapStack[event.channel.id].leftMixingBridge= event.timestamp;
                if(event.channel.connected.number){
                self.mapStack[event.channel.id].recepcionado= event.channel.connected.number;
                }
            }
            let hasLeft = self.mixingBridge.find((element)=>{
                return element.channelId === event.channel.id;    
            })
             //toMixing.disconnected = event.timestamp; 
            //createReporte(toMixing,event.timestamp)
            self.mixingBridge = self.mixingBridge.filter((element,index)=>{
                return element.channelId !== event.channel.id;
            })
             
          });
  }
    function createReporte(event,self){
      try{
    Reporte.create(self.mapStack[event.channel.id],(err,doc)=>{
        self.mapStack[event.channel.id].idReporte = doc._id;
    })         
      }catch(e){
          console.log(e);
      }        
    }
    

    function updateReporte(idReporte,myReporte,self){
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
                      console.log("done");
                  });
                });       
        }catch(e){
            console.log(e)
        }
        
  }
 
  // handler for the dialed channel leaving Stasis
  function dialedExit(dialed, mixingBridge,self) {
  
      
    console.log(
      'Dialed channel %s has left our application, destroying mixing bridge %s',
      dialed.name, mixingBridge.id);
      //console.log('die');
    self.emit(`hangUp`,dialed.caller.number)
    mixingBridge.destroy(function(err) {
      if (err) {
        console.log(err);
      }    
    });
  }
  // handler for new mixing bridge ready for channels to be added to it
  function moveToMixingBridge(channel, dialed, mixingBridge, holdingBridge,self) {
    console.log('Adding channel %s and dialed channel %s to bridge %s',
        channel.name, dialed.name, mixingBridge.id);
        let currentStack = self.holdStack;
        let callThis = currentStack.find((element)=>{
            return element.channelId === channel.id;
        })
        callThis.idReporte=self.mapStack[channel.id].idReporte;
        
        callThis.dialed=dialed.caller.number;
      //console.log(callThis);
        self.emit('ChannelEnteredMixingBridge',callThis)
      
    holdingBridge.removeChannel({channel: channel.id}, function(err) {
      if (err) {
        console.log(err);
      }

      mixingBridge.addChannel(
          {channel: [channel.id, dialed.id]}, function(err) {
        if (err) {
          console.log(err);
        }else{

        //self.emit(`${dialed.channel.number}:answer`, callThis.condo,"192.168.0.200")
        }
              
              
      });
    });
  }
    function removeBridges(self){
        self.bridges.list((err,bridges)=>{
            bridges.forEach((element)=>{
                if(element.name==="porteros" || element.bridge_type === "mixing"){
                self.bridges.destroy(  {bridgeId: element.id},()=>{console.log('done rev')})
                }
            })
            
        })
    }