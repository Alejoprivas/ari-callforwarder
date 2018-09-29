'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './controlador.routes';

export class ControladorComponent {
  /*@ngInject*/
        controladors=[];
        itemModel=[];
        totalItems = 5;
        currentPage = 1;
        item='';
        uncallForm(){
        this.singleUser={};
        selectForm = '';
    }



  constructor($http ,Modal, $timeout,$scope, socket,$uibModal) {
   'ngInject';

         
 this.empleado = '';
 this.condominio = ''; 
 this.maxSize = 5;
 this.currentPage = 1;     
 this.condominios;
 this.itemModel={
            io:[{nombre:'',pin:''}]
        };      
    this.modal=Modal;
    this.$http = $http;
    this.socket = socket;
    $scope.$on('$destroy', function() {
      socket.removeAll();
    });

      this.modificar = this.modal.confirm.modify( selected=>{});
      this.customAdd = this.modal.confirm.custom((item)  =>{
          this.addcontrolador(item);
      });
      this.customMod = this.modal.confirm.custom((modify)  =>{
          this.modcontrolador(modify);
      });
   this.delete = this.modal.confirm.delete( item => {
     this.delcontrolador(item);
    });
  }

  $onInit() {
      this.$http.get('/api/controladors')
      .then(response => {
          console.log(response.data)
        this.controladors = response.data;
         console.log(this.controladors)
        this.socket.syncUpdates('controlador', this.controladors);
      });
      
     this.$http.get('/api/condominios')
      .then(response => {
        this.condominios = response.data;
      });
  }


    newModal() {
    let addcontrolador={
        scope:{condominios:this.condominios,
               item:this.itemModel
              },
        controller:'controladorComponent',
        as:'controladorCtrl',
        html:'addContForm.html',
    }
    let modalInstance = this.customAdd(addcontrolador);
  }
  modModal(item) {
      var copy = angular.copy(item);
      let modcontrolador={
        scope:{item:item,
               copy,
              condominios:this.condominios},
        controller:'controladorComponent',
        as:'controladorCtrl',
        html:'addContForm.html',
    }
    this.customMod(modcontrolador);
  }

addcontrolador(item) { 
    console.log(item);
        this.$http.post('/api/controladors/',item).then((response)=>{
         console.log(response)
        });
  }
 
modcontrolador(modded) {
    console.log(modded)
    if(modded) {
          this.$http.put(`/api/controladors/${modded._id}`,modded).then((response) =>  {

      this.$http.get('/api/controladors')
      .then(response => {
        this.controladors = response.data;
        this.socket.unsyncUpdatesNew('controladors', this.controladors);
        this.socket.syncUpdates('controladors', this.controladors);
      });
          });
    }
  }
delcontrolador(item) {
    if(item) {
  this.$http.delete(`/api/controladors/${item._id}`).then(() =>  {});
    }
  }
getInfo(item) {
    if(item) {
        console.log()
    return this.condominios.find((element)=>{
            return element._id===item;
        });

    }
  }



}

export default angular.module('ffullApp.controlador', [uiRouter])
  .config(routes)
  .component('controlador', {
    template: require('./controlador.html'),
    controller: ControladorComponent,
    controllerAs: 'controladorCtrl'
  })
  .name;
