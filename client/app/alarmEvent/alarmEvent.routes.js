'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('alarmEvent', {
      url: '/alarmEvent',
      template: '<alarm-event></alarm-event>'
    });
}
