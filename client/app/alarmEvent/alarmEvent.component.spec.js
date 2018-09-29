'use strict';

describe('Component: AlarmEventComponent', function() {
  // load the controller's module
  beforeEach(module('fullstackApp.alarmEvent'));

  var AlarmEventComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    AlarmEventComponent = $componentController('alarmEvent', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
