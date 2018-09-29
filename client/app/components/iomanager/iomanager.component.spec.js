'use strict';

describe('Component: iomanager', function() {
  // load the component's module
  beforeEach(module('porterosApp.iomanager'));

  var iomanagerComponent;

  // Initialize the component and a mock scope
  beforeEach(inject(function($componentController) {
    iomanagerComponent = $componentController('iomanager', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
