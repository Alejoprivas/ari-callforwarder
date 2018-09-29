/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/alarmConfigs              ->  index
 * POST    /api/alarmConfigs              ->  create
 * GET     /api/alarmConfigs/:id          ->  show
 * PUT     /api/alarmConfigs/:id          ->  upsert
 * PATCH   /api/alarmConfigs/:id          ->  patch
 * DELETE  /api/alarmConfigs/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import AlarmConfig from './alarmConfig.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      // eslint-disable-next-line prefer-reflect
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of AlarmConfigs
export function index(req, res) {
  return AlarmConfig.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single AlarmConfig from the DB
export function show(req, res) {
  return AlarmConfig.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new AlarmConfig in the DB
export function create(req, res) {
  return AlarmConfig.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given AlarmConfig in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return AlarmConfig.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing AlarmConfig in the DB
export function patch(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return AlarmConfig.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a AlarmConfig from the DB
export function destroy(req, res) {
  return AlarmConfig.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
