'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newMonitor;

describe('Monitor API:', function() {
  describe('GET /	', function() {
    var monitors;

    beforeEach(function(done) {
      request(app)
        .get('/	')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          monitors = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      monitors.should.be.instanceOf(Array);
    });
  });

  describe('POST /	', function() {
    beforeEach(function(done) {
      request(app)
        .post('/	')
        .send({
          name: 'New Monitor',
          info: 'This is the brand new monitor!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newMonitor = res.body;
          done();
        });
    });

    it('should respond with the newly created monitor', function() {
      newMonitor.name.should.equal('New Monitor');
      newMonitor.info.should.equal('This is the brand new monitor!!!');
    });
  });

  describe('GET /	/:id', function() {
    var monitor;

    beforeEach(function(done) {
      request(app)
        .get(`/	/${newMonitor._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          monitor = res.body;
          done();
        });
    });

    afterEach(function() {
      monitor = {};
    });

    it('should respond with the requested monitor', function() {
      monitor.name.should.equal('New Monitor');
      monitor.info.should.equal('This is the brand new monitor!!!');
    });
  });

  describe('PUT /	/:id', function() {
    var updatedMonitor;

    beforeEach(function(done) {
      request(app)
        .put(`/	/${newMonitor._id}`)
        .send({
          name: 'Updated Monitor',
          info: 'This is the updated monitor!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedMonitor = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedMonitor = {};
    });

    it('should respond with the updated monitor', function() {
      updatedMonitor.name.should.equal('Updated Monitor');
      updatedMonitor.info.should.equal('This is the updated monitor!!!');
    });

    it('should respond with the updated monitor on a subsequent GET', function(done) {
      request(app)
        .get(`/	/${newMonitor._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let monitor = res.body;

          monitor.name.should.equal('Updated Monitor');
          monitor.info.should.equal('This is the updated monitor!!!');

          done();
        });
    });
  });

  describe('PATCH /	/:id', function() {
    var patchedMonitor;

    beforeEach(function(done) {
      request(app)
        .patch(`/	/${newMonitor._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Monitor' },
          { op: 'replace', path: '/info', value: 'This is the patched monitor!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedMonitor = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedMonitor = {};
    });

    it('should respond with the patched monitor', function() {
      patchedMonitor.name.should.equal('Patched Monitor');
      patchedMonitor.info.should.equal('This is the patched monitor!!!');
    });
  });

  describe('DELETE /	/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/	/${newMonitor._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when monitor does not exist', function(done) {
      request(app)
        .delete(`/	/${newMonitor._id}`)
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
