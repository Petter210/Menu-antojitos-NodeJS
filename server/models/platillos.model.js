const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
// const Platillos = require('./categoria.model');

let Schema = mongoose.Schema;

let platillosSchema = new Schema({
    strNombre: {
        type: String,
        required: [true, 'Favor de ingresar el nombre del platillo']
    },
    strDesc: {
        type: String,
        required: [true, 'Favor de ingresar la descripción del platillo']
    },
    strIngredientes: {
        type: String,
        required: [true, 'Favor de ingresar los ingredientes del platillo']
    },
    nmbPiezas: {
        type: Number,
        required: [true, 'Favor de ingresar las piezas']
    },
    nmbPrecio: {
        type: Number,
        required: [true, 'Favor de ingresar el nombre del platillo']
    },
    
    blnActivo: {
        type: Boolean,
        default: true
    }
});

platillosSchema.plugin(uniqueValidator, {
    message: '{PATH} Debe ser único y diferente'
});

module.exports = mongoose.model('Platillos', platillosSchema)
