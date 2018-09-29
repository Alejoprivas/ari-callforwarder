'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newAlarmEvent;

describe('AlarmEvent API:', function() {
  describe('GET /api/alarmEvents', function() {
    var alarmEvents;

    beforeEach(function(done) {
      request(app)
        .get('/api/alarmEvents')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          alarmEvents = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(alarmEvents).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/alarmEvents', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/alarmEvents')
        .send({
          name: 'New AlarmEvent',
          info: 'This is the brand new alarmEvent!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newAlarmEvent = res.body;
          done();
        });
    });

    it('should respond with the newly created alarmEvent', function() {
      expect(newAlarmEvent.name).to.equal('New AlarmEvent');
      expect(newAlarmEvent.info).to.equal('This is the brand new alarmEvent!!!');
    });
  });

  describe('GET /api/alarmEvents/:id', function() {
    var alarmEvent;

    beforeEach(function(done) {
      request(app)
        .get(`/api/alarmEvents/${newAlarmEvent._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          alarmEvent = res.body;
          done();
        });
    });

    afterEach(function() {
      alarmEvent = {};
    });

    it('should respond with the requested alarmEvent', function() {
      expect(alarmEvent.name).to.equal('New AlarmEvent');
      expect(alarmEvent.info).to.equal('This is the brand new alarmEvent!!!');
    });
  });

  describe('PUT /api/alarmEvents/:id', function() {
    var updatedAlarmEvent;

    beforeEach(function(done) {
      request(app)
        .put(`/api/alarmEvents/${newAlarmEvent._id}`)
        .send({
          name: 'Updated AlarmEvent',
          info: 'This is the updated alarmEvent!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedAlarmEvent = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedAlarmEvent = {};
    });

    it('should respond with the updated alarmEvent', function() {
      expect(updatedAlarmEvent.name).to.equal('Updated AlarmEvent');
      expect(updatedAlarmEvent.info).to.equal('This is the updated alarmEvent!!!');
    });

    it('should respond with the updated alarmEvent on a subsequent GET', function(done) {
      request(app)
        .get(`/api/alarmEvents/${newAlarmEvent._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let alarmEvent = res.body;

          expect(alarmEvent.name).to.equal('Updated AlarmEvent');
          expect(alarmEvent.info).to.equal('This is the updated alarmEvent!!!');

          done();
        });
    });
  });

  describe('PATCH /api/alarmEvents/:id', function() {
    var patchedAlarmEvent;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/alarmEvents/${newAlarmEvent._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched AlarmEvent' },
          { op: 'replace', path: '/info', value: 'This is the patched alarmEvent!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedAlarmEvent = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedAlarmEvent = {};
    });

    it('should respond with the patched alarmEvent', function() {
      expect(patchedAlarmEvent.name).to.equal('Patched AlarmEvent');
      expect(patchedAlarmEvent.info).to.equal('This is the patched alarmEvent!!!');
    });
  });

  describe('DELETE /api/alarmEvents/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/alarmEvents/${newAlarmEvent._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when alarmEvent does not exist', function(done) {
      request(app)
        .delete(`/api/alarmEvents/${newAlarmEvent._id}`)
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
