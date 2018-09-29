'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './alarma.routes';

export class AlarmaComponent {
  /*@ngInject*/
        alarmas=[];
        totalItems = 5;
        currentPage = 1;
        item='';
        uncallForm(){
        this.singleUser={};
        selectForm = '';
    }

  constructor($http ,Modal, $timeout,$scope, socket,$uibModal) {
   'ngInject';

      
///////
 this.empleado = '';
 this.condominio = ''; 
 this.dt = new Date();
 this.dt2 = new Date();
 this.dt.setHours(0,0,0,0);
 this.dt2.setHours(23,59,59,999);
 this.state = false;
 this.dateOptions = {
    formatYear: 'yy',
    maxDate: new Date(2020, 5, 22),
    minDate: new Date(),
    startingDay: 1
  };      
 
 this.maxSize = 5;
 this.currentPage = 1;     
      
      ///////
      
    this.modal=Modal;
    this.$http = $http;
    this.socket = socket;
    $scope.$on('$destroy', function() {
      socket.unsyncUpdatesNew('alarmConfig');
    });

      this.modificar = this.modal.confirm.modify( selected=>{});
      this.customAdd = this.modal.confirm.custom((item)  =>{
          console.log(item)
          this.addAlarm(item);
      });
      this.customMod = this.modal.confirm.custom((modify)  =>{
          this.modAlarm(modify);


      });
   this.delete = this.modal.confirm.delete( item => {
     this.delAlarm(item);
    });
  }

  $onInit() {
      this.$http.get('/api/alarmConfigs')
      .then(response => {
        this.alarmas = response.data;
        this.socket.syncUpdates('alarmConfig', this.alarmas);
      });
      
     this.$http.get('/api/users/').then(response => {this.users =response.data});
      
  }
query(){
         
      this.$http.post('/api/alarmEvents/query',{
    params: { dt1: this.dt, 
              dt2: this.dt2, 
              empleado: this.empleado, 
              condominio: this.condominio 
            }
}).then(response => {
          console.log(response);
        this.misReportes = response.data;
        this.totalItems =response.data.length;
      });
  }


  open1() {
    this.state= true;
  }    
  open2() {
    this.state2= true;
  }    

    newModal() {
    let addAlarm={
        scope:{},
        controller:'AlarmaComponent',
        as:'alarmCtrl',
        html:'addAlarmForm.html',
    }
    let modalInstance = this.customAdd(addAlarm);
  }
  modModal(item) {
      var copy = angular.copy(item);
      let modAlarm={
        scope:{item:item,
               copy},
        controller:'AlarmaComponent',
        as:'alarmCtrl',
        html:'modAlarmForm.html',
    }
    this.customMod(modAlarm);
  }

addAlarm(item) {
    console.log(item);
        this.$http.post('/api/alarmConfigs/',item).then((response)=>{
         console.log(response)
        });
  }
modAlarm(modded) {
    console.log(modded)
    if(modded) {
          this.$http.put(`/api/alarmConfigs/${modded._id}`,modded).then((response) =>  {

      this.$http.get('/api/alarmConfigs')
      .then(response => {
        this.alarmas = response.data;
        this.socket.unsyncUpdatesNew('alarmConfig', this.alarmas);
        this.socket.syncUpdates('alarmConfig', this.alarmas);
      });
          });
    }

  }
delAlarm(item) {
    if(item) {
  this.$http.delete(`/api/alarmConfigs/${item._id}`).then(() =>  {});

    }

  }


}

export default angular.module('fullstackApp.alarma', [uiRouter])
  .config(routes)
  .component('alarma', {
    template: require('./alarma.html'),
    controller: AlarmaComponent,
    controllerAs: 'alarmaCtrl'
  })
.controller('AlarmaComponent', AlarmaComponent)
  .name;
