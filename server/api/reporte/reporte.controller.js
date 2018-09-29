/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/reportes              ->  index
 * POST    /api/reportes              ->  create
 * GET     /api/reportes/:id          ->  show
 * PUT     /api/reportes/:id          ->  upsert
 * PATCH   /api/reportes/:id          ->  patch
 * DELETE  /api/reportes/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Reporte from './reporte.model';

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

// Gets a list of Reportes
export function index(req, res) {
  return Reporte.find().sort({_id:-1}).populate([
    {path: 'operador',select: '-_id -salt -password'},
    {path: 'apertura',select: '-operador'}
    ])    
      .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Reporte from the DB
export function show(req, res) {
  return Reporte.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}
export function query(req, res) {
 console.log(req.body)
    let searchParams = {};
   // searchParams['joinedHoldingBridge'] = { "$gte": new Date(req.body.params.dt1) , "$lt": new Date(req.body.params.dt2)};
if(req.body.params.user){
searchParams['operador'] = req.body.params.user;
}
if(req.body.params.condominio){
searchParams['condo.nombre'] = req.body.params.condominio;
}

/*
      {
          joinedHoldingBridge: { "$gte": new Date(req.body.params.dt1) , "$lt": new Date(req.body.params.dt2)} ,
          'operador':  myOperator
          //'/condo/_id': (req.body.params.condominio) ? (req.body.params.condominio ) : /.*/
/*    
      }
*/    
    
  return Reporte.find(searchParams
  ).sort({_id:-1}).populate([
    {path: 'operador',select: '-_id -salt -password'},
    {path: 'apertura',select: '-operador'}
    ]).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));    
    
}

// Creates a new Reporte in the DB
export function create(req, res) {
  return Reporte.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Reporte in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Reporte.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Reporte in the DB
export function patch(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Reporte.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Reporte from the DB
export function destroy(req, res) {
  return Reporte.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
