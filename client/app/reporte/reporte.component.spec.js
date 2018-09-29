'use strict';

describe('Component: ReporteComponent', function() {
  // load the controller's module
  beforeEach(module('fullstackApp.reporte'));

  var ReporteComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    ReporteComponent = $componentController('reporte', {});
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
