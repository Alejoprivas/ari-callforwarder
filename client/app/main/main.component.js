import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';


export class MainController {
  audio = [];
  maxSize = 5;
  totalItems = [];
  currentPage = 1;
  awesomeThings = [];
  callStack = [];
  testStack = [];
  caller = [];
  newThing = '';
  pickedCaller = '';
  confirmarEntrada ='';
  ipStream =[]; 
  observacion ='';
  reporteCompleto = {};
  /*@ngInject*/
  constructor($http, socket,Auth,$scope,$timeout) {

    this.audio = new Audio('/api/video/music/playMusic');
    this.audio.loop=true;
    this.newThing=0;
    this.$timeout = $timeout;
    this.Auth = Auth;
    this.$http = $http
    this.socket = socket;
    this.$scope = $scope ;
    this.myName = this.Auth.getCurrentUserSync().name;
      
    this.myExtension = this.Auth.getCurrentUserSync().extension;
    this.myRole = this.Auth.getCurrentUserSync().role;
    $scope.$on('$destroy', function() {
    socket.removeAll();
    })
  }

  $onInit() {
    this.socket.syncCallStack(this.callStack,this.testStack);
    this.socket.syncSoporte(this.myExtension,this.caller,this.totalItems,this.ipStream);
  }

  pickResidente(residente){
      if(residente){          
      this.pickedCaller =  JSON.parse(angular.toJson(residente));
      this.reporteCompleto.responsable = JSON.parse(angular.toJson(residente));
      this.caller[0].responsable = JSON.parse(angular.toJson(residente));
      }
      if(!residente){
         this.pickedCaller ="";
         this.reporteCompleto.responsable="";
         this.caller[0].responsable="";
         }
  }


  confirmar(){
      let reporteData={};
      if(this.pickedCaller){
      reporteData.responsable = this.pickedCaller;
      reporteData.soporte = this.myExtension;
      reporteData.condominio = this.caller[0];

      this.reporteCompleto.confirmarEntrada=true;

          this.socket.confirmar(reporteData);
      }

  }
  forceCall(){
          this.socket.forceCall();
      

  }
  answer(callers, dontTransfer=false) {
      console.log(callers)
      callers.dontTransfer = dontTransfer;

      this.socket.answerPhone(callers,this.myExtension);
  }
  sendDtmf() {
      this.socket.sendDtmf();
  }
  colgar(data) {
      //this.socket.hangUp(this.reporteCompleto);
      console.log(data);
      this.socket.hangUp(data);
      this.pickedCaller = "";
      this.observacion = "";
      this.reporteCompleto = {};
  }

  deleteThing(thing) {
    this.$http.delete(`/api/things/${thing._id}`);
  }
}

export default angular.module('fullstackApp.main', [uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController
  })
  .name;
