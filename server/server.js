require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const app = express();

const bodyParser = require('body-parser');


// CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json());

app.use(require('./routes/categorias'));
app.get('/', function(req, res) {
    res.send('back')
})

mongoose.connect('mongodb://localhost:27017/antojitosDB', (err, res) => {

    if (err) throw err;
    console.log('Base de datos en linea');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto:', process.env.PORT);
});