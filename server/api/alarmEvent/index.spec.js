'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var alarmEventCtrlStub = {
  index: 'alarmEventCtrl.index',
  show: 'alarmEventCtrl.show',
  create: 'alarmEventCtrl.create',
  upsert: 'alarmEventCtrl.upsert',
  patch: 'alarmEventCtrl.patch',
  destroy: 'alarmEventCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var alarmEventIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './alarmEvent.controller': alarmEventCtrlStub
});

describe('AlarmEvent API Router:', function() {
  it('should return an express router instance', function() {
    expect(alarmEventIndex).to.equal(routerStub);
  });

  describe('GET /api/alarmEvents', function() {
    it('should route to alarmEvent.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'alarmEventCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/alarmEvents/:id', function() {
    it('should route to alarmEvent.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'alarmEventCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/alarmEvents', function() {
    it('should route to alarmEvent.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'alarmEventCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/alarmEvents/:id', function() {
    it('should route to alarmEvent.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'alarmEventCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/alarmEvents/:id', function() {
    it('should route to alarmEvent.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'alarmEventCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/alarmEvents/:id', function() {
    it('should route to alarmEvent.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'alarmEventCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
