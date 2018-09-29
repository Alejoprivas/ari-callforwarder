/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/alarmEvents              ->  index
 * POST    /api/alarmEvents              ->  create
 * GET     /api/alarmEvents/:id          ->  show
 * PUT     /api/alarmEvents/:id          ->  upsert
 * PATCH   /api/alarmEvents/:id          ->  patch
 * DELETE  /api/alarmEvents/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import AlarmEvent from './alarmEvent.model';
 
let moment = require('moment');
function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

export function filter(req, res) {
  return AlarmEvent.find(
      {
    'fecha': { "$gte": new Date(req.body.params.dt1), "$lt": new Date(req.body.params.dt2)} ,
    //'hora': { "$gte": moment(req.body.params.dt1).format('hh:mm:ss'),"$lt":moment(req.body.params.dt2).format('hh:mm:ss')} ,
    //'empresa': (req.body.params.condominio) ? (req.body.params.condominio ) : /.*/
    'userid':  (req.body.params.empleado) ? (req.body.params.empleado ) : /.*/
      
      }
  ).sort({_id:-1}).limit(10).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));    
    
}


function patchUpdates(patches) {
  return function(entity) {
    try { 
      jsonpatch.applyPatch(entity, patches, /*validate*/ false);
         
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

// Gets a list of AlarmEvents
export function index(req, res) {
  return AlarmEvent.find({visto: false }).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single AlarmEvent from the DB
export function show(req, res) {
  return AlarmEvent.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new AlarmEvent in the DB
export function create(req, res) {
  return AlarmEvent.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given AlarmEvent in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return AlarmEvent.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing AlarmEvent in the DB
export function patch(req, res) {

  return AlarmEvent.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}
// Updates an existing AlarmEvent in the DB
export function phantoms(req, res) {

    return  res.status(204).end();
}

// Deletes a AlarmEvent from the DB
export function destroy(req, res) {
  return AlarmEvent.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
