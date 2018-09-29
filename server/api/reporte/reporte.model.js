'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './reporte.events';

var ReporteSchema = new mongoose.Schema({
    joinedHoldingBridge : {type: Date},
    leftHoldingBridge : {type: Date},
    joinedMixingBridge : {type: Date},
    leftMixingBridge : {type: Date},
    endStasis : String,
    condo:{},
    operador : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    tags : {},
    responsable : {},
    visitante : {},
    observacion : String,
    apertura: [{type: mongoose.Schema.Types.ObjectId, ref: 'Apertura',default:[]}]
});

registerEvents(ReporteSchema);
export default mongoose.model('Reporte', ReporteSchema);
