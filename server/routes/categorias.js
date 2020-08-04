const express = require('express');
const app = express();
const Categorias = require('../models/categoria.model');

// obtener las categorias
app.get('/obtener', function(req, res) {
    Categorias.find({})
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }


            res.status(200).json({
                ok: true,
                categorias
            })


        })
});

// registrar categorías 
app.post('/registrar', (req, res) => {

    var body = req.body;

    var categoria = new Categorias({
        strNombre: body.strNombre,
        strDesc: body.strDesc
    });

    categoria.save((err, categoriaGuardado) =>{

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear la categoria',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            categoria: categoriaGuardado
        });
    })

});

// actualizar categorias
app.put('/actualizar/:id', (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Categorias.findById(id, (err, categoria) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar la categoria',
                errors: err
            });
        }

        if (!categoria) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La categoria con el id ' + id + ' no existe',
                errors: { message: 'No existe una categoria con ese ID' }
            });
        }


        categoria.strNombre = body.strNombre;
        // categoria.usuario = req.usuario._id;
        categoria.strDesc = body.strDesc;

        categoria.save((err, categoriaGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                categoria: categoriaGuardado
            });

        });

    });

});



module.exports = app;