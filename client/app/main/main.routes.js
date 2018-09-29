'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('main', {
    url: '/main', 
    authenticate: ['user','conserje'],    
    resolve:{
      'getCurrentUser':function(Auth,socket){
        if(socket.ioSocket.disconnected && Auth.getToken()){    
        console.log('recon');
        socket.socketReconnect(Auth.getToken());
        }
        return Auth.getCurrentUser();
     }
    },
    template: '<main></main>'
  });
}
