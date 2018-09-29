/**
 * Controlador model events
 */

'use strict';

import {EventEmitter} from 'events';
var ControladorEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ControladorEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};




// Register the event emitter to the model events
function registerEvents(Controlador) {
  for(var e in events) {
    let event = events[e];
    Controlador.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    ControladorEvents.emit(event + ':' + doc._id, doc);
    ControladorEvents.emit(event, doc);
  };
}

export {registerEvents};
export default ControladorEvents;
