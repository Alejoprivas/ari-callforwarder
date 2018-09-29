'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var alarmConfigCtrlStub = {
  index: 'alarmConfigCtrl.index',
  show: 'alarmConfigCtrl.show',
  create: 'alarmConfigCtrl.create',
  upsert: 'alarmConfigCtrl.upsert',
  patch: 'alarmConfigCtrl.patch',
  destroy: 'alarmConfigCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var alarmConfigIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './alarmConfig.controller': alarmConfigCtrlStub
});

describe('AlarmConfig API Router:', function() {
  it('should return an express router instance', function() {
    expect(alarmConfigIndex).to.equal(routerStub);
  });

  describe('GET /api/alarmConfigs', function() {
    it('should route to alarmConfig.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'alarmConfigCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/alarmConfigs/:id', function() {
    it('should route to alarmConfig.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'alarmConfigCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/alarmConfigs', function() {
    it('should route to alarmConfig.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'alarmConfigCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/alarmConfigs/:id', function() {
    it('should route to alarmConfig.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'alarmConfigCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/alarmConfigs/:id', function() {
    it('should route to alarmConfig.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'alarmConfigCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/alarmConfigs/:id', function() {
    it('should route to alarmConfig.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'alarmConfigCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
