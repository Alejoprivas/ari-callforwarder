'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('controlador', {
      url: '/controlador',
      authenticate: 'admin',
      template: '<controlador></controlador>'
    });
}
