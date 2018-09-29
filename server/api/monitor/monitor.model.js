'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './monitor.events';

var MonitorSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

registerEvents(MonitorSchema);
export default mongoose.model('Monitor', MonitorSchema);
