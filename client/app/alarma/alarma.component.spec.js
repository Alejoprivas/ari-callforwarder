'use strict';

describe('Component: AlarmaComponent', function() {
  // load the controller's module
  beforeEach(module('fullstackApp.alarma'));

  var AlarmaComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    AlarmaComponent = $componentController('alarma', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
