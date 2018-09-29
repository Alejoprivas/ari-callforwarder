'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var videosCtrlStub = {
  index: 'videosCtrl.index',
  show: 'videosCtrl.show',
  create: 'videosCtrl.create',
  upsert: 'videosCtrl.upsert',
  patch: 'videosCtrl.patch',
  destroy: 'videosCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var videosIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './videos.controller': videosCtrlStub
});

describe('Videos API Router:', function() {
  it('should return an express router instance', function() {
    videosIndex.should.equal(routerStub);
  });

  describe('GET /api/video', function() {
    it('should route to videos.controller.index', function() {
      routerStub.get
        .withArgs('/', 'videosCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/video/:id', function() {
    it('should route to videos.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'videosCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/video', function() {
    it('should route to videos.controller.create', function() {
      routerStub.post
        .withArgs('/', 'videosCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/video/:id', function() {
    it('should route to videos.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'videosCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/video/:id', function() {
    it('should route to videos.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'videosCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/video/:id', function() {
    it('should route to videos.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'videosCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
