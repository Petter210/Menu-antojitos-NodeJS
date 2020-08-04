const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Platillos = require('./platillos.model');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    strNombre: {
        type: String,
        required: [true, 'Llena la categoria'],
        unique: true

    },
    strDesc: {
        type: String
    },
    aJsnPlatillos: [Platillos.schema],

    blnActivo: {
        type: Boolean,
        default: true
    }
});

categoriaSchema.plugin(uniqueValidator, {
    message: '{PATH} Debe ser único y diferente'
});

module.exports = mongoose.model('Categoria', categoriaSchema);

// a partir del video 92 registro categorias