'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('condominio', {
      url: '/condominio',
       
      authenticate: 'admin',
      template: '<condominio></condominio>'
    });
}
