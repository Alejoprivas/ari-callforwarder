'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');



import routes from './condominio.routes';

export class CondominioComponent {
  callForm() {
  this.startForm=true;  
  }
  unCallForm() {
      
      
  this.startForm=false;  
    this.residentes = [];
  this.newCondo = {
      nombre: "",
      direccion: "",
      extension: " ",
      residentes: ""
  };
    this.updateC =false;
    this.getCondos(function(me) { });
  }    
    
//patrones//
  emailPattern = /^([a-zA-Z0-9])+([a-zA-Z0-9._%+-])+@([a-zA-Z0-9_.-])+\.(([a-zA-Z]){2,6})$/;  
  numberPattern = /^[0-9]{0,}$/;  
  textPattern = /^[a-zA-Z ]{1,25}$/;

  maxSize = 5;
  totalItems = 1;
  currentPage = 1;    



  condominios = [];
  newCondo = {
      nombre: "",
      direccion: "",
      extension: " ",
      encargado: "",
      telefono: "",
      residentes: ""
  };
  extensiones = [];

//**residentes**//
  searchText="";
  test="";
  residentes = [];
  selectedAll = false;
  updateC = false;

//************///
  /*@ngInject*/
  constructor($http ,$scope) {
    this.$scope = $scope
    this.startForm=false;
    this.$http = $http;
  }

  $onInit() {
this.getCondos();
  }

  addCondo() {

    var newDataList=[];
    angular.forEach(this.residentes, function(selected){
        if(selected.piso){
            newDataList.push(selected);
        }
    }); 
     this.residentes = newDataList;    
      console.log(this.newCondo);
    this.newCondo.residentes = this.residentes;

    if(this.newCondo) {
      this.$http.post('/api/condominios', {
        condo: this.newCondo
      }).then(() =>  {this.unCallForm()});
 
    } 
  }

  deleteCondo(condo) {

    this.$http.delete(`/api/condominios/${condo._id}`).then(() =>  {this.unCallForm()});

  }  
  getCondos() {
    this.$http.get('/api/condominios')
      .then(response => {
        console.log(response.data)
        this.condominios = response.data;
        this.totalItems = response.data.length;
      });
  }

  selectCondo(condo) {
    
    this.updateC=true;
    this.newCondo = condo;
    this.residentes = condo.residentes;
    this.callForm();
  }

  updateCondo(){
    var newDataList=[];
      
    angular.forEach(this.residentes, function(selected){
        if(selected.piso){
            newDataList.push(selected);
        }
    }); 
     this.residentes = newDataList;    
    this.newCondo.residentes = this.residentes;
    if(this.newCondo) {
          this.$http.put(`/api/condominios/${this.newCondo._id}`,this.newCondo).then(() =>  {this.unCallForm()});
    }
  }

///***residente ****///

    addResidente(){

    if(this.residentes.length>0){
        this.residentes[this.residentes.length-1].selected=false;
        this.residentes[this.residentes.length-1].inserted=false;
    }
        
    this.residentes.push({
      piso: "",
      telefono: "",
      selected: false,
      inserted: true
  });
    }

    remove(index){  
        
            var newDataList=[];
            this.selectedAll = false;
            angular.forEach(this.residentes, function(selected){
                if(!selected.selected){
                    newDataList.push(selected);
                }
            }); 
            this.residentes = newDataList;
    }


        checkAll(selectedAll){    
        if (!selectedAll) {
            selectedAll = false;
        } else {
            selectedAll = true;
        }
        angular.forEach(this.residentes, function(residentes) {

            residentes.selected = selectedAll;
        });
    }
}

export default angular.module('fullstackApp.condominio', [uiRouter])
  .config(routes)
  .component('condominio', {
    template: require('./condominio.html'),
    controller: CondominioComponent,
    controllerAs: 'condominioCtrl'
  })
  .name;
