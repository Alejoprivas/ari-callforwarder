'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './apertura.events';

//import Reporte from '../reporte/reporte.model';

var AperturaSchema = new mongoose.Schema({
    posicion:String,
    fecha: {type: Date,default: Date.now},
    operador:String,
    condominio: {type: mongoose.Schema.Types.ObjectId, ref: 'Condominio'},
    reporte:  {type: mongoose.Schema.Types.ObjectId, ref: 'Reporte'},
    tipo: {type: String,default: "manual"},
    visitante: String,
    responsable: String,
    active: Boolean
});
/*
AperturaSchema.post('save', function(elem) {
    if(elem.reporte){ 
        Reporte.findById(elem.reporte, function (err, doc) { 
         doc.controlador.push(elem._id); 
          doc.save();
        });
    }
});
AperturaSchema.post('remove', function(elem) {
    if(elem.reporte){
        AperturaSchema.findById(elem.reporte, function (err, doc) { 
         if(err)

         doc.controlador.filter((element)=>{
             console.log(element);
             return elem._id !== element 
         }); 
          doc.save();
        });
    }
});
*/
registerEvents(AperturaSchema);
export default mongoose.model('Apertura', AperturaSchema);
