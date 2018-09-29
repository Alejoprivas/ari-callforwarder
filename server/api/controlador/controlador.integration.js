'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newControlador;

describe('Controlador API:', function() {
  describe('GET /api/controladors', function() {
    var controladors;

    beforeEach(function(done) {
      request(app)
        .get('/api/controladors')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          controladors = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(controladors).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/controladors', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/controladors')
        .send({
          name: 'New Controlador',
          info: 'This is the brand new controlador!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newControlador = res.body;
          done();
        });
    });

    it('should respond with the newly created controlador', function() {
      expect(newControlador.name).to.equal('New Controlador');
      expect(newControlador.info).to.equal('This is the brand new controlador!!!');
    });
  });

  describe('GET /api/controladors/:id', function() {
    var controlador;

    beforeEach(function(done) {
      request(app)
        .get(`/api/controladors/${newControlador._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          controlador = res.body;
          done();
        });
    });

    afterEach(function() {
      controlador = {};
    });

    it('should respond with the requested controlador', function() {
      expect(controlador.name).to.equal('New Controlador');
      expect(controlador.info).to.equal('This is the brand new controlador!!!');
    });
  });

  describe('PUT /api/controladors/:id', function() {
    var updatedControlador;

    beforeEach(function(done) {
      request(app)
        .put(`/api/controladors/${newControlador._id}`)
        .send({
          name: 'Updated Controlador',
          info: 'This is the updated controlador!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedControlador = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedControlador = {};
    });

    it('should respond with the updated controlador', function() {
      expect(updatedControlador.name).to.equal('Updated Controlador');
      expect(updatedControlador.info).to.equal('This is the updated controlador!!!');
    });

    it('should respond with the updated controlador on a subsequent GET', function(done) {
      request(app)
        .get(`/api/controladors/${newControlador._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let controlador = res.body;

          expect(controlador.name).to.equal('Updated Controlador');
          expect(controlador.info).to.equal('This is the updated controlador!!!');

          done();
        });
    });
  });

  describe('PATCH /api/controladors/:id', function() {
    var patchedControlador;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/controladors/${newControlador._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Controlador' },
          { op: 'replace', path: '/info', value: 'This is the patched controlador!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedControlador = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedControlador = {};
    });

    it('should respond with the patched controlador', function() {
      expect(patchedControlador.name).to.equal('Patched Controlador');
      expect(patchedControlador.info).to.equal('This is the patched controlador!!!');
    });
  });

  describe('DELETE /api/controladors/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/controladors/${newControlador._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when controlador does not exist', function(done) {
      request(app)
        .delete(`/api/controladors/${newControlador._id}`)
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
