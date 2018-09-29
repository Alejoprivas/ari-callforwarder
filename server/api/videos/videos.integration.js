'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newVideos;

describe('Videos API:', function() {
  describe('GET /api/video', function() {
    var videoss;

    beforeEach(function(done) {
      request(app)
        .get('/api/video')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          videoss = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      videoss.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/video', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/video')
        .send({
          name: 'New Videos',
          info: 'This is the brand new videos!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newVideos = res.body;
          done();
        });
    });

    it('should respond with the newly created videos', function() {
      newVideos.name.should.equal('New Videos');
      newVideos.info.should.equal('This is the brand new videos!!!');
    });
  });

  describe('GET /api/video/:id', function() {
    var videos;

    beforeEach(function(done) {
      request(app)
        .get(`/api/video/${newVideos._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          videos = res.body;
          done();
        });
    });

    afterEach(function() {
      videos = {};
    });

    it('should respond with the requested videos', function() {
      videos.name.should.equal('New Videos');
      videos.info.should.equal('This is the brand new videos!!!');
    });
  });

  describe('PUT /api/video/:id', function() {
    var updatedVideos;

    beforeEach(function(done) {
      request(app)
        .put(`/api/video/${newVideos._id}`)
        .send({
          name: 'Updated Videos',
          info: 'This is the updated videos!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedVideos = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedVideos = {};
    });

    it('should respond with the updated videos', function() {
      updatedVideos.name.should.equal('Updated Videos');
      updatedVideos.info.should.equal('This is the updated videos!!!');
    });

    it('should respond with the updated videos on a subsequent GET', function(done) {
      request(app)
        .get(`/api/video/${newVideos._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let videos = res.body;

          videos.name.should.equal('Updated Videos');
          videos.info.should.equal('This is the updated videos!!!');

          done();
        });
    });
  });

  describe('PATCH /api/video/:id', function() {
    var patchedVideos;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/video/${newVideos._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Videos' },
          { op: 'replace', path: '/info', value: 'This is the patched videos!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedVideos = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedVideos = {};
    });

    it('should respond with the patched videos', function() {
      patchedVideos.name.should.equal('Patched Videos');
      patchedVideos.info.should.equal('This is the patched videos!!!');
    });
  });

  describe('DELETE /api/video/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/video/${newVideos._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when videos does not exist', function(done) {
      request(app)
        .delete(`/api/video/${newVideos._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
