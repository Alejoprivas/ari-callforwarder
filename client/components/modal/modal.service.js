'use strict';

import angular from 'angular';

export function Modal($rootScope, $uibModal) {
  'ngInject';    
  /**
   * Opens a modal
   * @param  {Object} scope      - an object to be merged with modal's scope
   * @param  {String} modalClass - (optional) class(es) to be applied to the modal
   * @return {Object}            - the instance $uibModal.open() returns
   */
  function openModal(scope = {}, modalClass = 'modal-default') {
    var modalScope = $rootScope.$new();

    angular.extend(modalScope, scope);

    return $uibModal.open({
      template: require('./modal.html'),
      windowClass: modalClass,
      scope: modalScope
    });
  }  
    function modModal(scope = {}, modalClass = 'modal-primary') {

    var modalScope = $rootScope.$new();

    angular.extend(modalScope, scope);    
    

    return $uibModal.open({
      template: require('./modifyModal.html'),
      windowClass: modalClass, 
      scope: modalScope,
      controller: 'AdminController', 
      controllerAs: 'admin',   
    });
  }  
    function customMade(scope,controller,controllerAs,Html) {
    var modalScope = $rootScope.$new();
    angular.extend(modalScope, scope); 
    var myModal = $uibModal.open({
      template: require(`./modalHtml/${Html}`),
      windowClass: 'modal-primary', 
      scope: modalScope,
      controller: function($scope,$uibModalInstance){
          
          $scope.addElement = (myArray,element)=>{
              console.log(myArray);
              myArray.push(element);
          }          
          $scope.removeElement = (myArray)=>{
              if(myArray.length>0){
              myArray.pop();
              }
          }
          
           $scope.ok = function (item) { 
            $uibModalInstance.close(item);
           };

          $scope.cancel = function (copy) {
            $uibModalInstance.close('cancel');
          };            
      }
    });            

    return myModal;  
  }

  // Public API here
  return {

    /* Confirmation modals */
    confirm: {

      /**
       * Create a function to open a delete confirmation modal (ex. ng-click='myModalFn(name, arg1, arg2...)')
       * @param  {Function} del - callback, ran when delete is confirmed
       * @return {Function}     - the function to open the modal (ex. myModalFn)
       */
      delete(del = angular.noop) {
        /**
         * Open a delete confirmation modal
         * @param  {String} name   - name or info to show on modal
         * @param  {All}           - any additional args are passed straight to del callback
         */
        return function(...args) {
            
          var slicedArgs = Array.prototype.slice.call(args); 
          var name = slicedArgs.shift();
          var deleteModal;

          deleteModal = openModal({
            modal: {
              dismissable: true,
              title: 'Confirmar eliminacion',
              html: `<p>¿Esta seguro que desea borrar <strong>${name}</strong> ?</p>`,
              buttons: [{
                classes: 'btn-danger',
                text: 'Delete',
                click(e) {
                  deleteModal.close(e);
                }
              }, {
                classes: 'btn-default',
                text: 'Cancel',
                click(e) {
                  deleteModal.dismiss(e);
                }
              }]
            }
          }, 'modal-danger');

          deleteModal.result.then(function(event) {
            Reflect.apply(del, event, slicedArgs);
          });
        };
      },
      modify( ) {
        /**
         * Open a delete confirmation modal
         * @param  {String} name   - name or info to show on modal
         * @param  {All}           - any additional args are passed straight to del callback
         */
        return function(selected) { 
          var modifyModal;   
          modifyModal = modModal({modal:  selected});

        };
      },
      custom(end = angular.noop) {
        /**
         * Open a delete confirmation modal
         * @param  {String} name   - name or info to show on modal
         * @param  {All}           - any additional args are passed straight to del callback
         */
        return function(...args) { 
            
          var features = args.shift();  

          var customModal; 
          customModal = customMade(features.scope,features.controller,features.as,features.html); 
            
          customModal.result.then(function(item) {
            if(item !== 'cancel'){
            end(item);}  
          });
            
        };
      }
    }
  };
}

export default angular.module('fullstackApp.Modal', [])
  .factory('Modal', Modal)
  .name;
