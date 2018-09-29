'use strict';

describe('Component: ControladorComponent', function() {
  // load the controller's module
  beforeEach(module('ffullApp.controlador'));

  var ControladorComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    ControladorComponent = $componentController('controlador', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
