'use strict';

const angular = require('angular');
export default class AdminController {
        extensiones={};
        selectedUser ={};
        selectForm ='';

        totalItems = 5;
        currentPage = 1;    

    uncallForm(){
        this.singleUser={};
        selectForm = '';
    }
  
    /*@ngInject*/
  constructor(User , $http ,Modal, $timeout) {
    

    this.modal=Modal;
    this.$http = $http;  
      
        this.$http.get('/api/users/')
      .then(response => {
        this.users = response.data;
        this.totalItems = response.data.length;
      });      
      
   this.delete = this.modal.confirm.delete( user => {
       console.log(user)
      user.$remove();
      this.users.splice(this.users.indexOf(user), 1);
    });
      this.modificar = this.modal.confirm.modify( selected=>{}); 
      
  } 
  
    getUsers() {
        this.$http.get('/api/users/').then(response => {this.users =response.data
        totalItems = response.data.length;
        console.log(response.data)
      });
      console.log('refre');
  }  
  changeUser(user) { 
         this.$http.post(`/api/users/changeExt`,user).then(() => {
             this.getUsers();
      }); 
  }
  
}
