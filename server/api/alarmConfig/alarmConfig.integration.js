'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newAlarmConfig;

describe('AlarmConfig API:', function() {
  describe('GET /api/alarmConfigs', function() {
    var alarmConfigs;

    beforeEach(function(done) {
      request(app)
        .get('/api/alarmConfigs')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          alarmConfigs = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(alarmConfigs).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/alarmConfigs', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/alarmConfigs')
        .send({
          name: 'New AlarmConfig',
          info: 'This is the brand new alarmConfig!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newAlarmConfig = res.body;
          done();
        });
    });

    it('should respond with the newly created alarmConfig', function() {
      expect(newAlarmConfig.name).to.equal('New AlarmConfig');
      expect(newAlarmConfig.info).to.equal('This is the brand new alarmConfig!!!');
    });
  });

  describe('GET /api/alarmConfigs/:id', function() {
    var alarmConfig;

    beforeEach(function(done) {
      request(app)
        .get(`/api/alarmConfigs/${newAlarmConfig._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          alarmConfig = res.body;
          done();
        });
    });

    afterEach(function() {
      alarmConfig = {};
    });

    it('should respond with the requested alarmConfig', function() {
      expect(alarmConfig.name).to.equal('New AlarmConfig');
      expect(alarmConfig.info).to.equal('This is the brand new alarmConfig!!!');
    });
  });

  describe('PUT /api/alarmConfigs/:id', function() {
    var updatedAlarmConfig;

    beforeEach(function(done) {
      request(app)
        .put(`/api/alarmConfigs/${newAlarmConfig._id}`)
        .send({
          name: 'Updated AlarmConfig',
          info: 'This is the updated alarmConfig!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedAlarmConfig = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedAlarmConfig = {};
    });

    it('should respond with the updated alarmConfig', function() {
      expect(updatedAlarmConfig.name).to.equal('Updated AlarmConfig');
      expect(updatedAlarmConfig.info).to.equal('This is the updated alarmConfig!!!');
    });

    it('should respond with the updated alarmConfig on a subsequent GET', function(done) {
      request(app)
        .get(`/api/alarmConfigs/${newAlarmConfig._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let alarmConfig = res.body;

          expect(alarmConfig.name).to.equal('Updated AlarmConfig');
          expect(alarmConfig.info).to.equal('This is the updated alarmConfig!!!');

          done();
        });
    });
  });

  describe('PATCH /api/alarmConfigs/:id', function() {
    var patchedAlarmConfig;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/alarmConfigs/${newAlarmConfig._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched AlarmConfig' },
          { op: 'replace', path: '/info', value: 'This is the patched alarmConfig!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedAlarmConfig = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedAlarmConfig = {};
    });

    it('should respond with the patched alarmConfig', function() {
      expect(patchedAlarmConfig.name).to.equal('Patched AlarmConfig');
      expect(patchedAlarmConfig.info).to.equal('This is the patched alarmConfig!!!');
    });
  });

  describe('DELETE /api/alarmConfigs/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/alarmConfigs/${newAlarmConfig._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when alarmConfig does not exist', function(done) {
      request(app)
        .delete(`/api/alarmConfigs/${newAlarmConfig._id}`)
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
