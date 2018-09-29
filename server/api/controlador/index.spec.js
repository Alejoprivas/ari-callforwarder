'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var controladorCtrlStub = {
  index: 'controladorCtrl.index',
  show: 'controladorCtrl.show',
  create: 'controladorCtrl.create',
  upsert: 'controladorCtrl.upsert',
  patch: 'controladorCtrl.patch',
  destroy: 'controladorCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var controladorIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './controlador.controller': controladorCtrlStub
});

describe('Controlador API Router:', function() {
  it('should return an express router instance', function() {
    expect(controladorIndex).to.equal(routerStub);
  });

  describe('GET /api/controladors', function() {
    it('should route to controlador.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'controladorCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/controladors/:id', function() {
    it('should route to controlador.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'controladorCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/controladors', function() {
    it('should route to controlador.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'controladorCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/controladors/:id', function() {
    it('should route to controlador.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'controladorCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/controladors/:id', function() {
    it('should route to controlador.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'controladorCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/controladors/:id', function() {
    it('should route to controlador.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'controladorCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
