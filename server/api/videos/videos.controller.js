/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/video              ->  index
 * POST    /api/video              ->  create
 * GET     /api/video/:id          ->  show
 * PUT     /api/video/:id          ->  upsert
 * PATCH   /api/video/:id          ->  patch
 * DELETE  /api/video/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Videos from './videos.model';
import mongoose from 'mongoose';
let util = require('util');
var fs = require("fs");
var Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;
var gfs = new Grid(mongoose.connection.db);
var mm = require('musicmetadata'); 
 
export function upload(req, res) {
	    	var part = req.files.filename;
                var writeStream = gfs.createWriteStream({
                    filename: part.name,
    				mode: 'w',
                    root: 'my_collection',
                    content_type:part.mimetype
                });
                writeStream.on('close', function(file) {
                    console.log(file._id);
                     return res.status(200).send({
						message: 'Success'
					});
                });
                writeStream.write(part.data);
                writeStream.end();
};
 
export function read (req, res) {
    gfs.collection('my_collection');
	gfs.findOne({ _id: req.params.id }).toArray(function (err, files) {
 	    if(files.length===0){
			return res.status(400).send({
				message: 'File not found'
			});
 	    }
		res.writeHead(200, {'Content-Type': files[0].contentType});
		var readstream = gfs.createReadStream({
			  filename: files[0].filename
		});
	    readstream.on('data', function(data) {
	        res.write(data);
            console.log(data+'data');
	    });
	    readstream.on('end', function() {
	        res.end();        
	    });
		readstream.on('error', function (err) {
		  console.log('An error occurred!', err);
		  throw err;
		});
	});

};

export function playMusic ( req, res){  
   var filePath = 'Moh/Music.mp3';
    var stat = fs.statSync(filePath);
    res.writeHead(200, {
        'Content-Type': 'audio/mp3',
        'Content-Length': stat.size
    });
    
    var readStream = fs.createReadStream(filePath); 
	    readStream.on('data', function(data) {
	        res.write(data); 
	    });
	    readStream.on('end', function() {
	        res.end();        
	    });
		readStream.on('error', function (err) {
		  console.log('An error occurred!', err);
		  throw err;
		});
}


export function playVid (req, res) {
    gfs.collection('my_collection');
	gfs.findOne({ _id: req.params.id }, function (err, file) {
         if (err) {
                return res.status(400).send({
                    err: errorHandler.getErrorMessage(err)
                });
            }
            if (!file) {
                return res.status(404).send({
                    err: 'No se encontró el registro especificado.'
                });
            }
            if (req.headers['range']) {
                var parts = req.headers['range'].replace(/bytes=/, "").split("-");
                var partialstart = parts[0];
                var partialend = parts[1];

                var start = parseInt(partialstart, 10);
                var end = partialend ? parseInt(partialend, 10) : file.length - 1;
                var chunksize = (end - start) + 1;
                console.log(start);        
                res.writeHead(206, {
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunksize,
                    'Content-Range': 'bytes ' + start + '-' + end + '/' + file.length,
                    'Content-Type': file.contentType
                });
                 gfs.createReadStream({
                    _id: file._id,
                    range: {
                        startPos: start,
                        endPos: end
                    }
                }).pipe(res);               
            }
        else {
                res.header('Content-Length', file.length);
                res.header('Content-Type', file.contentType);

                gfs.createReadStream({
                    _id: file._id
                }).pipe(res);
            }
	});

};

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

// Gets a list of Videoss
export function index(req, res) {
  return Videos.find().sort({_id:-1}).limit(100).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}
//filter
export function filter(req, res) {
 
  return Videos.find(
      {
          uploadDate: { "$gte": new Date(req.body.params.dt1) , "$lt": new Date(req.body.params.dt2)} ,
          'metadata.receptor.name':  (req.body.params.empleado) ? (req.body.params.empleado ) : /.*/,
          'metadata.condominio': (req.body.params.condominio) ? (req.body.params.condominio ) : /.*/
      
      }
  ).sort({_id:-1}).limit(100).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));    
    
}

// Gets a single Videos from the DB
export function show(req, res) {
  return Videos.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Videos in the DB
export function create(req, res) {
  return Videos.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Videos in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Videos.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Videos in the DB
export function patch(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Videos.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Videos from the DB
export function destroy(req, res) {
  return Videos.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
