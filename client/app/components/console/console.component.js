'use strict';
const angular = require('angular');

export class consoleComponent {
  /*@ngInject*/
    
  constructor(adminSocket,$http,Auth) {
    'ngInject';
    var vm = this; 
    this.message = 'World';
    this.io = this.io;
    this.$http = $http;
    this.resp = this.resp;
    this.adminSocket = adminSocket;
    this.Auth = Auth;
    this.myName = this.Auth.getCurrentUserSync();
    this.newApertura = {
    operador:this.myName._id,
    posicion:""
  };   
  }

          
   runCom(command){
    this.adminSocket.sendCommand(command);   
   }          
   register(command){
    this.adminSocket.register(command);   
   }          
   leave(command){
    this.adminSocket.leave(command);   
   }
    
}

export default angular.module('porterosApp.console', [])
  .component('console', {
    template: require('./console.html'),
    bindings: {
        condo: '=',
        io: '=',
        resp: '='
    },
    controller: consoleComponent,
    controllerAs: '$conCtrl'
  })
  .name;
