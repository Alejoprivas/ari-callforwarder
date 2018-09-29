'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newApertura;

describe('Apertura API:', function() {
  describe('GET /api/aperturas', function() {
    var aperturas;

    beforeEach(function(done) {
      request(app)
        .get('/api/aperturas')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          aperturas = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(aperturas).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/aperturas', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/aperturas')
        .send({
          name: 'New Apertura',
          info: 'This is the brand new apertura!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newApertura = res.body;
          done();
        });
    });

    it('should respond with the newly created apertura', function() {
      expect(newApertura.name).to.equal('New Apertura');
      expect(newApertura.info).to.equal('This is the brand new apertura!!!');
    });
  });

  describe('GET /api/aperturas/:id', function() {
    var apertura;

    beforeEach(function(done) {
      request(app)
        .get(`/api/aperturas/${newApertura._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          apertura = res.body;
          done();
        });
    });

    afterEach(function() {
      apertura = {};
    });

    it('should respond with the requested apertura', function() {
      expect(apertura.name).to.equal('New Apertura');
      expect(apertura.info).to.equal('This is the brand new apertura!!!');
    });
  });

  describe('PUT /api/aperturas/:id', function() {
    var updatedApertura;

    beforeEach(function(done) {
      request(app)
        .put(`/api/aperturas/${newApertura._id}`)
        .send({
          name: 'Updated Apertura',
          info: 'This is the updated apertura!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedApertura = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedApertura = {};
    });

    it('should respond with the updated apertura', function() {
      expect(updatedApertura.name).to.equal('Updated Apertura');
      expect(updatedApertura.info).to.equal('This is the updated apertura!!!');
    });

    it('should respond with the updated apertura on a subsequent GET', function(done) {
      request(app)
        .get(`/api/aperturas/${newApertura._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let apertura = res.body;

          expect(apertura.name).to.equal('Updated Apertura');
          expect(apertura.info).to.equal('This is the updated apertura!!!');

          done();
        });
    });
  });

  describe('PATCH /api/aperturas/:id', function() {
    var patchedApertura;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/aperturas/${newApertura._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Apertura' },
          { op: 'replace', path: '/info', value: 'This is the patched apertura!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedApertura = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedApertura = {};
    });

    it('should respond with the patched apertura', function() {
      expect(patchedApertura.name).to.equal('Patched Apertura');
      expect(patchedApertura.info).to.equal('This is the patched apertura!!!');
    });
  });

  describe('DELETE /api/aperturas/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/aperturas/${newApertura._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when apertura does not exist', function(done) {
      request(app)
        .delete(`/api/aperturas/${newApertura._id}`)
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
