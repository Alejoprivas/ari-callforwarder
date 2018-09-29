'use strict';

describe('Component: CondominioComponent', function() {
  // load the controller's module
  beforeEach(module('fullstackApp.condominio'));

  var CondominioComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    CondominioComponent = $componentController('condominio', {});
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
