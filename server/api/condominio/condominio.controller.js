/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/condominios              ->  index
 * POST    /api/condominios              ->  create
 * GET     /api/condominios/:id          ->  show
 * PUT     /api/condominios/:id          ->  upsert
 * PATCH   /api/condominios/:id          ->  patch
 * DELETE  /api/condominios/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Condominio from './condominio.model';

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
        console.log('err',err)
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

// Gets a list of Condominios
export function index(req, res) {
  return Condominio.find().populate({
    path: 'controlador',
  }).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Condominio from the DB
export function show(req, res) {
  return Condominio.findById(req.params.id).populate({
    path: 'controlador',
  }).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Condominio in the DB
export function create(req, res) {
console.log(req.body.condo)
  return Condominio.create(req.body.condo)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Condominio in the DB at the specified ID
export function upsert(req, res) {
    console.log(req.body);
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Condominio.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Condominio in the DB
export function patch(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Condominio.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Condominio from the DB
export function destroy(req, res) {
  return Condominio.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
