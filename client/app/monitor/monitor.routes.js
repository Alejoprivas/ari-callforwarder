'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('monitor', {
      url: '/monitor',
    authenticate: 'admin',
      template: '<monitor></monitor>'
    });
}
