'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './apertura.routes';

export class AperturaComponent {


            misAperturas = [];

            condominio = 0;
            empleado = 0;
            condominios =[]
            users =[]
            dt2 =new Date();
            state2 =false;
            dateOptions2 = {
                formatYear: 'yy',
                maxDate: new Date(2020, 5, 22),
                minDate: new Date(),
                startingDay: 1                
            };

            dt =0;
            state =false;
            dateOptions = {
                formatYear: 'yy',
                maxDate: new Date(2020, 5, 22),
                minDate: new Date(),
                startingDay: 1                
            };

            maxSize = 5;
            totalItems = 1;
            currentPage = 1;
            API= null;

            onPlayerReady = function(API) {
                this.API = API;
            };
            
            config = {
                preload: "none",
                sources: [],
                theme: {
                    url: "http://www.videogular.com/styles/themes/default/latest/videogular.css"
                }
            }     

      /*@ngInject*/
  constructor($http,$timeout) {

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
      
 this.$http = $http;
 this.$timeout = $timeout;
 this.maxSize = 5;
 this.currentPage = 1;
 var micontroller = this;
      
  }

$onInit() {
    this.$http.get('/api/video/getMeta')
      .then(response => {
        this.misAperturas = response.data;
        this.totalItems =response.data.length;
      });
        this.$http.get('/api/condominios')
      .then(response => {
        this.condominios = response.data; 
       // this.empleado = response.data[0].name;
      });
     this.$http.get('/api/users/').then(response => {this.users =response.data
      
      });
    
  }
 
    query(){
        console.log(this.empleado)
      this.$http.post('/api/video/query',{
    params: { dt1: this.dt, 
              dt2: this.dt2, 
              user: this.empleado, 
              condominio: this.condominio, 
            }
}).then(response => {
        this.misAperturas = response.data;
        this.totalItems =response.data.length;
      });
  }
 

  open1() {
    this.state= true;
  }    
  open2() {
    this.state2= true;
  }    
  playVideo(video) {
      let items = [];
      
      let apiurl="/api/video/";
      items.push([{src: apiurl+video._id, type: "video/mp4"}]);
      
      
      this.config.sources = items[0];
      this.$timeout(this.API.play.bind(this.API), 100);
        
  }     
}
export default angular.module('porterosApp.apertura', [uiRouter])
  .config(routes)
  .component('apertura', {
    template: require('./apertura.html'),
    controller: AperturaComponent,
    controllerAs: 'aperturaCtrl'
  })
  .name;
