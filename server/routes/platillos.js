const express = require('express');
const app = express();

const mongoose = require('mongoose');
// const _ = require('underscore');
const Platillos = require('../models/platillos.model');
const Categoria = require('../models/categoria.model');


// obtener platillos
app.get('/obtenerP/:idCategoria', (req, res) => {
    Categoria.aggregate([{
                $unwind: '$aJsnPlatillos'
            },
            {
                $match: {
                    '_id': mongoose.Types.ObjectId(req.params.idCategoria),
                    'blnActivo': true
                }
            },
            {
                $replaceRoot: {
                    newRoot: '$aJsnPlatillos'
                }
            }
        ]).sort({ created_at: 'desc' })
        .then((platillo) => {

            if (platillo.length > 0) {

                return res.status(200).json({
                    ok: true,
                    resp: 200,
                    msg: 'Informacion obtenida exitosamente.',
                    cont: {
                        platillo
                    }
                });

            } else {

                return res.status(404).json({
                    ok: true,
                    resp: 404,
                    msg: 'La categoría no existe o no cuenta con platillos',
                    cont: {
                        platillo
                    }
                });

            }

        })
        .catch((err) => {

            return res.status(500).json({
                ok: false,
                resp: 500,
                msg: 'Error al obtener los platillos de la categoría.',
                cont: {
                    err: err.message
                }
            });

        });
});


// registrar platillos 
app.post('/registrarP/:idCategoria', (req, res) => {
    const platillo = new Platillos(req.body);
    let err = platillo.validateSync();

    if (err) {
        return res.status(500).json({
            ok: false,
            resp: 500,
            msg: 'Error: Error al registrar el platillo',
            cont: {
                err
            }
        });
    }

    Categoria.findOne({
            '_id': req.params.idCategoria,
            'aJsnPlatillos.strNombre': platillo.strNombre,
            'aJsnPlatillos.blnActivo': true
        })
        .populate('aJsnPlatillos')
        .then((resp) => {
            if (resp) {

                return res.status(400).json({
                    ok: false,
                    resp: 400,
                    msg: `Error: El platillo " ${platillo.strNombre} " ya se encuentra registrado.`,
                    cont: {
                        resp
                    }
                });
            } else {
                Categoria.findOneAndUpdate({
                        '_id': req.params.idCategoria
                    }, {
                        $push: {
                            aJsnPlatillos: platillo
                        }
                    })
                    .then((categoria) => {
                        return res.status(200).json({
                            ok: true,
                            resp: 200,
                            msg: 'Success: Informacion insertada correctamente.',
                            cont: {
                                platillo
                            }
                        });
                    })
                    .catch((err) => {
                        return res.status(500).json({
                            ok: false,
                            resp: 500,
                            msg: 'Error: Error al registrar el platillo',
                            cont: {
                                err: err.message
                            }
                        });
                    });
            }
        })
        .catch((err) => {
            return res.status(500).json({
                ok: false,
                resp: 500,
                msg: 'Error: Error interno',
                cont: {
                    err: err.message
                }
            });
        });
});

// actualizar platillos
app.put('/actualizarP/:idCategoria/:idPlatillo', (req, res) => {

    let platillo = new Platillos({
        _id: req.params.idPlatillo,
        strNombre: req.body.strNombre,
        strDesc: req.body.strDesc,
        strIngredientes: req.body.strIngredientes,
        nmbPiezas: req.body.nmbPiezas,
        nmbPrecio: req.body.nmbPrecio,
        blnActivo: req.body.blnActivo
    });

    let err = platillo.validateSync();

    if (err) {

        return res.status(500).json({
            ok: false,
            resp: 500,
            msg: 'Error al actualizar los platillos',
            cont: {
                err
            }
        });

    }

    Categoria.aggregate([{
            $unwind: '$aJsnPlatillos'
        },
        {
            $match: {
                'aJsnPlatillos.blnActivo': true,
                'aJsnPlatillos.strNombre': req.body.strNombre
            }
        },
        {
            $replaceRoot: {
                newRoot: '$aJsnPlatillos'
            }
        }
    ], (err, resp) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                resp: 500,
                msg: 'Error del servidor',
                cont: {
                    err
                }
            });
        }

        if (resp.length > 0) {
            if (req.params.idPlatillo != resp[0]._id) {
                return res.status(400).json({
                    ok: false,
                    resp: 400,
                    msg: 'El platillo ya se encuentra registrado',
                    cont: {
                        resp
                    }
                });
            }
        }
        Categoria.findOneAndUpdate({
                '_id': req.params.idCategoria,
                'aJsnPlatillos._id': req.params.idPlatillo
            }, {
                $set: {
                    'aJsnPlatillos.$.strNombre': platillo.strNombre,
                    'aJsnPlatillos.$.strDesc': platillo.strDesc,
                    'aJsnPlatillos.$.strIngredientes': platillo.strIngredientes,
                    'aJsnPlatillos.$.nmbPiezas': platillo.nmbPiezas,
                    'aJsnPlatillos.$.nmbPrecio': platillo.nmbPrecio,
                    'aJsnPlatillos.$.blnActivo': platillo.blnActivo
                }
            })
            .then((platillo) => {

                return res.status(200).json({
                    ok: true,
                    resp: 200,
                    msg: 'Se ha actualizado exitosamente.',
                    cont: {
                        platillo
                    }
                });

            })
            .catch((err) => {

                return res.status(500).json({
                    ok: false,
                    resp: 500,
                    msg: 'Error al modificar el platillo',
                    cont: {
                        err
                    }
                });

            });
    });

});

module.exports = app;