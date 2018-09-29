'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var reporteCtrlStub = {
  index: 'reporteCtrl.index',
  show: 'reporteCtrl.show',
  create: 'reporteCtrl.create',
  upsert: 'reporteCtrl.upsert',
  patch: 'reporteCtrl.patch',
  destroy: 'reporteCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var reporteIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './reporte.controller': reporteCtrlStub
});

describe('Reporte API Router:', function() {
  it('should return an express router instance', function() {
    expect(reporteIndex).to.equal(routerStub);
  });

  describe('GET /api/reportes', function() {
    it('should route to reporte.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'reporteCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/reportes/:id', function() {
    it('should route to reporte.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'reporteCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/reportes', function() {
    it('should route to reporte.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'reporteCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/reportes/:id', function() {
    it('should route to reporte.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'reporteCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/reportes/:id', function() {
    it('should route to reporte.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'reporteCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/reportes/:id', function() {
    it('should route to reporte.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'reporteCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
