'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newReporte;

describe('Reporte API:', function() {
  describe('GET /api/reportes', function() {
    var reportes;

    beforeEach(function(done) {
      request(app)
        .get('/api/reportes')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          reportes = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(reportes).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/reportes', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/reportes')
        .send({
          name: 'New Reporte',
          info: 'This is the brand new reporte!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newReporte = res.body;
          done();
        });
    });

    it('should respond with the newly created reporte', function() {
      expect(newReporte.name).to.equal('New Reporte');
      expect(newReporte.info).to.equal('This is the brand new reporte!!!');
    });
  });

  describe('GET /api/reportes/:id', function() {
    var reporte;

    beforeEach(function(done) {
      request(app)
        .get(`/api/reportes/${newReporte._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          reporte = res.body;
          done();
        });
    });

    afterEach(function() {
      reporte = {};
    });

    it('should respond with the requested reporte', function() {
      expect(reporte.name).to.equal('New Reporte');
      expect(reporte.info).to.equal('This is the brand new reporte!!!');
    });
  });

  describe('PUT /api/reportes/:id', function() {
    var updatedReporte;

    beforeEach(function(done) {
      request(app)
        .put(`/api/reportes/${newReporte._id}`)
        .send({
          name: 'Updated Reporte',
          info: 'This is the updated reporte!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedReporte = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedReporte = {};
    });

    it('should respond with the updated reporte', function() {
      expect(updatedReporte.name).to.equal('Updated Reporte');
      expect(updatedReporte.info).to.equal('This is the updated reporte!!!');
    });

    it('should respond with the updated reporte on a subsequent GET', function(done) {
      request(app)
        .get(`/api/reportes/${newReporte._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let reporte = res.body;

          expect(reporte.name).to.equal('Updated Reporte');
          expect(reporte.info).to.equal('This is the updated reporte!!!');

          done();
        });
    });
  });

  describe('PATCH /api/reportes/:id', function() {
    var patchedReporte;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/reportes/${newReporte._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Reporte' },
          { op: 'replace', path: '/info', value: 'This is the patched reporte!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedReporte = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedReporte = {};
    });

    it('should respond with the patched reporte', function() {
      expect(patchedReporte.name).to.equal('Patched Reporte');
      expect(patchedReporte.info).to.equal('This is the patched reporte!!!');
    });
  });

  describe('DELETE /api/reportes/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/reportes/${newReporte._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when reporte does not exist', function(done) {
      request(app)
        .delete(`/api/reportes/${newReporte._id}`)
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
