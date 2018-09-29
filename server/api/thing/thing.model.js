'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './thing.events';

var ThingSchema = new mongoose.Schema({
  name: String,
  info: String,
      fileName: String,
      url: String,
      contentType: String,
      size: String,
      dimensions: String,
  active: Boolean
});

registerEvents(ThingSchema);
export default mongoose.model('Thing', ThingSchema);
