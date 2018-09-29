'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './controlador.events';

import Condominio from '../condominio/condominio.model';

var Schema = mongoose.Schema;
var ControladorSchema = new mongoose.Schema({
  nombre: String,
  condominio: {type: Schema.Types.ObjectId, ref: 'Condominio'},
  io: [],
  active: Boolean
});

ControladorSchema.post('save', function(elem) {
Condominio.findById(elem.condominio, function (err, doc) { 
    
 doc.controlador.push(elem._id); 
  doc.save();
});
});
ControladorSchema.post('remove', function(elem) {
Condominio.findById(elem.condominio, function (err, doc) { 
 if(err)
     
 doc.controlador.filter((element)=>{
     console.log(element);
     return elem._id !== element 
 }); 
  doc.save();
});
});
registerEvents(ControladorSchema);

export default mongoose.model('Controlador', ControladorSchema); 