'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';

export class NavbarComponent {
  menu = [];

 menuLogged= [
  {
    title: 'Home',
    state: 'main'
  },     
  {
    title: 'Reporte',
    state: 'reporte'
  },{
    title: 'Aperturas',
    state: 'apertura'
  }];

 menuAdmin= [ {
    title: 'Controladores',
    state: 'controlador'
  },{
    title: 'Condominios',
    state: 'condominio'
  },{
    title: 'Admin',
    state: 'admin'
  },{
    title: 'Alarmas',
    state: 'alarma'
  }];

  isCollapsed = true;

  constructor(Auth, $scope,$window) {
    'ngInject';
    window.onbeforeunload = confirmExit;
    function confirmExit() {
        return "Esta seguro que quiere dejar la pagina?";
    }      
      
    this.isLoggedIn = Auth.isLoggedInSync;
    this.isAdmin = Auth.isAdminSync;
    this.getCurrentUser = Auth.getCurrentUserSync;
        
  }

}

export default angular.module('directives.navbar', [])
  .component('navbar', {
    template: require('./navbar.html'),
    controller: NavbarComponent
  })
  .name;
