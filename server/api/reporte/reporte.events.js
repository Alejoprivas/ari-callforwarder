/**
 * Reporte model events
 */

'use strict';

import {EventEmitter} from 'events';
var ReporteEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ReporteEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Reporte) {
  for(var e in events) {
    let event = events[e];
    Reporte.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    ReporteEvents.emit(event + ':' + doc._id, doc);
    ReporteEvents.emit(event, doc);
  };
}

export {registerEvents};
export default ReporteEvents;
