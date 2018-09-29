/**
 * Condominio model events
 */

'use strict';

import {EventEmitter} from 'events';
var CondominioEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
CondominioEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Condominio) {
  for(var e in events) {
    let event = events[e];
    Condominio.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    CondominioEvents.emit(event + ':' + doc._id, doc);
    CondominioEvents.emit(event, doc);
  };
}

export {registerEvents};
export default CondominioEvents;
