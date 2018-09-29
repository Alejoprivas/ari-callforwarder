'use strict';

import angular from 'angular';
// import ngAnimate from 'angular-animate';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';
import 'angular-socket-io';
import uiRouter from 'angular-ui-router';
import uiBootstrap from 'angular-ui-bootstrap';
import 'angular-validation-match';

//mis dependencias
import 'videogular-themes-default';
import 'videogular-buffering';
import 'videogular-controls';
import 'videogular-dash';
import 'videogular-ima-ads';
import 'videogular-overlay-play';
import 'videogular-poster';
import 'videogular-themes-default';


import 'bootstrap-ui-datetime-picker';

import 'ng-audio/dist/ng-audio.min';

import Modal from '../components/modal/modal.service';

import socket from '../components/socket/socket.service';
import control from '../components/socket/socket.control';
import adminSocket from '../components/socket/adminSocket';
//import monitorSocket from '../components/MonitorSocket/monitorSocket.service';

import iomanager from './components/iomanager/iomanager.component'; 
import console from './components/console/console.component'; 

import 'angularjs-datepicker';
import 'angularjs-datepicker/dist/angular-datepicker.min.css';
//final de mis dependencias

import {
  routeConfig
} from './app.config';

import _Auth from '../components/auth/auth.module';
import account from './account';
import admin from './admin';
 
import ReporteComponent from './reporte/reporte.component';
import CondominioComponent from './condominio/condominio.component';
import MonitorComponent from './monitor/monitor.component';
import AlarmaComponent from './alarma/alarma.component';
 import AlarmEventComponent from './alarmEvent/alarmEvent.component'; 
import ControladorComponent from './controlador/controlador.component';
    import AperturaComponent from './apertura/apertura.component';


import navbar from '../components/navbar/navbar.component';
import footer from '../components/footer/footer.component';
import main from './main/main.component';
import constants from './app.constants';
import util from '../components/util/util.module';
import 'angular-notification';
import './app.css';

 


angular.module('fullstackApp', [ 'notification',adminSocket,console,iomanager,control,ngCookies,ControladorComponent, ngResource, ngSanitize, uiRouter, uiBootstrap, Modal, _Auth,
  account,AlarmEventComponent,AperturaComponent,AlarmaComponent,CondominioComponent,MonitorComponent,ReporteComponent,'btford.socket-io','ngAudio', admin, "com.2fdevs.videogular",	"com.2fdevs.videogular.plugins.controls", socket,"com.2fdevs.videogular.plugins.overlayplay","com.2fdevs.videogular.plugins.poster",'ui.bootstrap.datetimepicker','720kb.datepicker', 'validation.match', navbar, footer, main, constants, util
])
  .config(routeConfig)
  .run(function($rootScope, $location, Auth) {
    'ngInject';
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function(event, next) {
      Auth.isLoggedIn(function(loggedIn) {
        if(next.authenticate && !loggedIn) {
          $location.path('/');
        }
          if(!next.authenticate && loggedIn) {
          $location.path('/reporte');
        }
      });
    });
  });

angular.element(document)
  .ready(() => {
    angular.bootstrap(document, ['fullstackApp'], {
      strictDi: true
    });
  });
