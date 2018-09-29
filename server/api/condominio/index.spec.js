'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var condominioCtrlStub = {
  index: 'condominioCtrl.index',
  show: 'condominioCtrl.show',
  create: 'condominioCtrl.create',
  upsert: 'condominioCtrl.upsert',
  patch: 'condominioCtrl.patch',
  destroy: 'condominioCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var condominioIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './condominio.controller': condominioCtrlStub
});

describe('Condominio API Router:', function() {
  it('should return an express router instance', function() {
    condominioIndex.should.equal(routerStub);
  });

  describe('GET /api/condominios', function() {
    it('should route to condominio.controller.index', function() {
      routerStub.get
        .withArgs('/', 'condominioCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/condominios/:id', function() {
    it('should route to condominio.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'condominioCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/condominios', function() {
    it('should route to condominio.controller.create', function() {
      routerStub.post
        .withArgs('/', 'condominioCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/condominios/:id', function() {
    it('should route to condominio.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'condominioCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/condominios/:id', function() {
    it('should route to condominio.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'condominioCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/condominios/:id', function() {
    it('should route to condominio.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'condominioCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
