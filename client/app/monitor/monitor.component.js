'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './monitor.routes';

export class MonitorComponent {
  /*@ngInject*/
    myUsers=[];
    testStack=[];
  constructor(socket,$scope,$rootScope) {    
    'ngInject';  
    this.socket = socket;
     $scope.$on('$destroy', function() {
      socket.unsyncAll();
    });    
  }
  $onInit() {
      this.socket.syncUsers(this.testStack,this.myUsers);
  }
    openDoor(controlador){
        console.log(controlador);
     this.socket.activarRele(controlador)   
    }
}


export default angular.module('fullstackApp.monitor', [uiRouter])
  .config(routes)
  .component('monitor', {
    template: require('./monitor.html'),
    controller: MonitorComponent,
    controllerAs: 'monitorCtrl'
  })
  .name;
