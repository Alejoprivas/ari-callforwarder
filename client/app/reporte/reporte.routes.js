'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('reporte', {
      url: '/reporte',
      template: '<reporte></reporte>',
      authenticate: true
    });
}
