'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var monitorCtrlStub = {
  index: 'monitorCtrl.index',
  show: 'monitorCtrl.show',
  create: 'monitorCtrl.create',
  upsert: 'monitorCtrl.upsert',
  patch: 'monitorCtrl.patch',
  destroy: 'monitorCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var monitorIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './monitor.controller': monitorCtrlStub
});

describe('Monitor API Router:', function() {
  it('should return an express router instance', function() {
    monitorIndex.should.equal(routerStub);
  });

  describe('GET /	', function() {
    it('should route to monitor.controller.index', function() {
      routerStub.get
        .withArgs('/', 'monitorCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /	/:id', function() {
    it('should route to monitor.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'monitorCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /	', function() {
    it('should route to monitor.controller.create', function() {
      routerStub.post
        .withArgs('/', 'monitorCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /	/:id', function() {
    it('should route to monitor.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'monitorCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /	/:id', function() {
    it('should route to monitor.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'monitorCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /	/:id', function() {
    it('should route to monitor.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'monitorCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
