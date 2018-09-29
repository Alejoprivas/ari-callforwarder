'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newCondominio;

describe('Condominio API:', function() {
  describe('GET /api/condominios', function() {
    var condominios;

    beforeEach(function(done) {
      request(app)
        .get('/api/condominios')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          condominios = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      condominios.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/condominios', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/condominios')
        .send({
          name: 'New Condominio',
          info: 'This is the brand new condominio!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newCondominio = res.body;
          done();
        });
    });

    it('should respond with the newly created condominio', function() {
      newCondominio.name.should.equal('New Condominio');
      newCondominio.info.should.equal('This is the brand new condominio!!!');
    });
  });

  describe('GET /api/condominios/:id', function() {
    var condominio;

    beforeEach(function(done) {
      request(app)
        .get(`/api/condominios/${newCondominio._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          condominio = res.body;
          done();
        });
    });

    afterEach(function() {
      condominio = {};
    });

    it('should respond with the requested condominio', function() {
      condominio.name.should.equal('New Condominio');
      condominio.info.should.equal('This is the brand new condominio!!!');
    });
  });

  describe('PUT /api/condominios/:id', function() {
    var updatedCondominio;

    beforeEach(function(done) {
      request(app)
        .put(`/api/condominios/${newCondominio._id}`)
        .send({
          name: 'Updated Condominio',
          info: 'This is the updated condominio!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedCondominio = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedCondominio = {};
    });

    it('should respond with the updated condominio', function() {
      updatedCondominio.name.should.equal('Updated Condominio');
      updatedCondominio.info.should.equal('This is the updated condominio!!!');
    });

    it('should respond with the updated condominio on a subsequent GET', function(done) {
      request(app)
        .get(`/api/condominios/${newCondominio._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let condominio = res.body;

          condominio.name.should.equal('Updated Condominio');
          condominio.info.should.equal('This is the updated condominio!!!');

          done();
        });
    });
  });

  describe('PATCH /api/condominios/:id', function() {
    var patchedCondominio;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/condominios/${newCondominio._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Condominio' },
          { op: 'replace', path: '/info', value: 'This is the patched condominio!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedCondominio = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedCondominio = {};
    });

    it('should respond with the patched condominio', function() {
      patchedCondominio.name.should.equal('Patched Condominio');
      patchedCondominio.info.should.equal('This is the patched condominio!!!');
    });
  });

  describe('DELETE /api/condominios/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/condominios/${newCondominio._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when condominio does not exist', function(done) {
      request(app)
        .delete(`/api/condominios/${newCondominio._id}`)
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
