/**
 * AlarmConfig model events
 */

'use strict';

import {EventEmitter} from 'events';
var AlarmConfigEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
AlarmConfigEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(AlarmConfig) {
  for(var e in events) {
    let event = events[e];
    AlarmConfig.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) { 
    AlarmConfigEvents.emit(event + ':' + doc._id, doc);
    AlarmConfigEvents.emit(event, doc);
  };
}

export {registerEvents};
export default AlarmConfigEvents;
