/**
 * Controlador model events
 */

'use strict';

import {EventEmitter} from 'events';
var ivsEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ivsEvents.setMaxListeners(0);

// Model events
var events = {
  answer: 'answer',
  join: 'join',
  hangup: 'hangup'
};




// Register the event emitter to the model events
function registerEvents(Controlador) {
  for(var e in events) {
    let event = events[e];
    Controlador.post(e, emitEvent(event));
  }
}

function ivsEvents(event) {
  return function(doc) {
    ivsEvents.emit(event + ':' + doc._id, doc);
    ivsEvents.emit(event, doc);
  };
}

export {registerEvents};
export default ivsEvents;
