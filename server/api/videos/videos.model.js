'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './videos.events';


var VideosSchema = new mongoose.Schema({
  filename: String,
  contentType: String,
  length: Number,
  chunkSize: Number,
  uploadDate: Date,
  md5: String,
    
}, 
{ collection : 'my_collection.files' });





registerEvents(VideosSchema);
export default mongoose.model('Videos', VideosSchema);

