'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './alarmConfig.events';

var AlarmConfigSchema = new mongoose.Schema({
  id: String,
  idAlarma: String,
  passw: String,
  nombre: String,
  empresa: String,
  direccion: String,
  telefono: String,
  abonando: String, 
  url: String
});

registerEvents(AlarmConfigSchema);
export default mongoose.model('AlarmConfig', AlarmConfigSchema);
