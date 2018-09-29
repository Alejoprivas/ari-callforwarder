'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('apertura', {
      url: '/apertura',
      authenticate: 'user',
      template: '<apertura></apertura>'
    });
}
