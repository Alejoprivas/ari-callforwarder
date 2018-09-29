'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var aperturaCtrlStub = {
  index: 'aperturaCtrl.index',
  show: 'aperturaCtrl.show',
  create: 'aperturaCtrl.create',
  upsert: 'aperturaCtrl.upsert',
  patch: 'aperturaCtrl.patch',
  destroy: 'aperturaCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var aperturaIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './apertura.controller': aperturaCtrlStub
});

describe('Apertura API Router:', function() {
  it('should return an express router instance', function() {
    expect(aperturaIndex).to.equal(routerStub);
  });

  describe('GET /api/aperturas', function() {
    it('should route to apertura.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'aperturaCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/aperturas/:id', function() {
    it('should route to apertura.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'aperturaCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/aperturas', function() {
    it('should route to apertura.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'aperturaCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/aperturas/:id', function() {
    it('should route to apertura.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'aperturaCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/aperturas/:id', function() {
    it('should route to apertura.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'aperturaCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/aperturas/:id', function() {
    it('should route to apertura.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'aperturaCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
