'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './alarmEvent.events';

var AlarmEventSchema = new mongoose.Schema({
  id: String,
  idAlarma: String,
  nombre: String,
  pr: String,
  fecha: Date,
  vistoEl: Date,
  hora: String,
  empresa: String,
  telefono: String,
  direccion: String,
  passw: String,
  url: String,
  evento: {},
  visto: { type: Boolean, default: false },
  procesado: { type: Boolean, default: false },
  username: String,
  userid: String,
  response: String,
});

registerEvents(AlarmEventSchema);
export default mongoose.model('AlarmEvent', AlarmEventSchema);
