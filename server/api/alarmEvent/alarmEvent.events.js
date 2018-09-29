/**
 * AlarmEvent model events
 */

'use strict';

import {EventEmitter} from 'events';
var AlarmEventEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
AlarmEventEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(AlarmEvent) {
  for(var e in events) {
    let event = events[e];
    AlarmEvent.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    AlarmEventEvents.emit(event + ':' + doc._id, doc);
    AlarmEventEvents.emit(event, doc);
  };
}

export {registerEvents};
export default AlarmEventEvents;
