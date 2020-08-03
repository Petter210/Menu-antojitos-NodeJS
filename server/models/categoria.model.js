const mongoose = require('mongoose');

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
    blnActivo: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Categoria', categoriaSchema);

// a partir del video 92 registro categorias