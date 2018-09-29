'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('alarma', {
    url: '/alarma',
    template: '<alarma></alarma>',
    authenticate: 'admin'
    });
}
