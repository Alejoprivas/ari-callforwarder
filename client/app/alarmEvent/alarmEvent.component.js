'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './alarmEvent.routes';

export class AlarmEventComponent {
  /*@ngInject*/
  constructor(socket,$http,$scope,Auth,  $window) {
    this.getCurrentUser = Auth.getCurrentUserSync;
    this.window = $window;
    this.$http = $http;
    this.socket = socket;
    $scope.$on('$destroy', function() {
      socket.unsyncUpdatesNew('alarmEvent');
    });
    this.alarmEvents=[]
  }

  $onInit() { 
      this.$http.get('/api/alarmEvents')
      .then(response => {
        this.alarmEvents = response.data;
        this.socket.syncUpdates('alarmEvent', this.alarmEvents);
      });
 
  }
    
    openTab(url,event){
    let user = {id: this.getCurrentUser()._id,name: this.getCurrentUser().name};        
  	var body = angular.element(this.window.document.body);
	var textarea = angular.element('<textarea/>');
	textarea.css({
		position: 'fixed',
		opacity: '0'
	});
        console.log(event)
		textarea.val(event.passw);
		body.append(textarea);
		textarea[0].select();
        

        document.execCommand('copy');
        
        this.window.open(url, '_blank');
        
    
       
       this.$http.patch(`/api/alarmEvents/${event._id}`,[ 
                                                    {op:"replace", path: "/visto", value: true },
                                                    {op:"replace", path:"/passw", value: ""  },
                                                    {op:"add", path:"/username", value: user.name},
                                                    {op:"add", path:"/vistoEl", value: new Date()},
                                                    {op:"add", path:"/userid", value: user.id}
                                                 ]).then((response) =>  {});
               
    }
    
}

export default angular.module('fullstackApp.alarmEvent', [uiRouter])
  .config(routes)
  .component('alarmEvent', {
    template: require('./alarmEvent.html'),
    controller: AlarmEventComponent,
    controllerAs: 'alarmEventCtrl'
  })
  .name;
