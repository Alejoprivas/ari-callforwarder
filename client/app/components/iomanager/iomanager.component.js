'use strict';
const angular = require('angular');

export class iomanagerComponent {
  /*@ngInject*/
    
  constructor(socket,$http,Auth) {
    'ngInject';
    var vm = this; 
    this.message = 'World';
    this.io = this.io;
    this.$http = $http;
    this.resp = this.resp;
    this.socket = socket;
    this.Auth = Auth;
    this.myName = this.Auth.getCurrentUserSync();
    this.condo=this.condo;
    this.reporte=this.reporte;
    this.channel=this.channel;
    this.newApertura = {
    operador:this.myName._id,
    posicion:""
  };      
      
  }
      confirmar(){
        if(this.reporte){
        this.newApertura.reporte= this.reporte ;
        this.newApertura.tipo = "Llamada";   
        }      
        
        this.socket.confirmar(this.channel);
        this.newApertura.posicion="Portero";
        this.addApertura();       
      }
    
    operarRele(pin,id,nombre){
        if(this.reporte){
        this.newApertura.reporte= this.reporte ;
        this.newApertura.tipo = "Llamada";   
        }
    this.newApertura.posicion=nombre;
    this.addApertura();
    //this.socket.activarRele({pin:pin,id:id})  
    }
    
   addApertura() {
    this.newApertura.operador=this.myName._id;
    this.newApertura.condominio=this.condo;
       
       
    console.log('added');
    if(this.newApertura) {
      this.$http.post('/api/aperturas/', this.newApertura).then((doc) =>  {
          if(this.reporte){
              this.$http.get(`/api/reportes/${this.reporte}`).then((myRep)=>{
                  console.log(myRep)
                  let miReporte = myRep.data;
                    miReporte.apertura.push(doc.data._id);
                    this.$http.put(`/api/reportes/${this.reporte}`,miReporte).then((theEnd)=>{
                        console.log(theEnd);
                    })
              })
          }
      });
 
    } 
  }   
    
    


}

export default angular.module('porterosApp.iomanager', [])
  .component('iomanager', {
    template: require('./iomanager.html'),
    bindings: {
        condo: '=',
        io: '=',
        reporte: '=',
        channel: '=',
        resp: '='
    },
    controller: iomanagerComponent,
    controllerAs: '$ioman'
  })
  .name;
