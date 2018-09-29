'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './condominio.events';
var Schema = mongoose.Schema;
var CondominioSchema = new mongoose.Schema({
  nombre: String,
  direccion: String,
  encargado: String,
  telefono: String,
  modelo: String,
  extension: String,
  controlador: [{type: Schema.Types.ObjectId, ref: 'Controlador',default:[]}],
  residentes: [],
  active: Boolean
});

registerEvents(CondominioSchema);
export default mongoose.model('Condominio', CondominioSchema);
