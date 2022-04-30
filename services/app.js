const express = require("express");
const bodyParser = require('body-parser');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const rTracer = require('cls-rtracer');
const path = require('path');
global.appRoot = path.resolve(__dirname);
global.marketplaceURL = 'https://recruitment.alegra.com/api/farmers-market/buy';

const app = express();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Content-Type", "application/json");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());
app.use(rTracer.expressMiddleware())

app.use(helmet())
app.use(compression())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());

app.get('/', function (req, res) {
    respuesta = {
        error: true,
        codigo: 200,
        mensaje: 'Punto de inicio'
    };
    res.send(respuesta);
});

app.use('/app/v1/recipes', require('./routes/recipes.routes'));
app.use('/app/v1/warehouse', require('./routes/warehouse.routes'));
app.use('/app/v1/orders', require('./routes/orders.routes'));

/*app.get('/recipes', function (req, res) {
    let recipes = 
    res.send(recipes);
});

app.post('/usuario', function (req, res) {
    if (!req.body.nombre || !req.body.apellido) {
        respuesta = {
            error: true,
            codigo: 502,
            mensaje: 'El campo nombre y apellido son requeridos'
        };
    } else {
        if (usuario.nombre !== '' || usuario.apellido !== '') {
            respuesta = {
                error: true,
                codigo: 503,
                mensaje: 'El usuario ya fue creado previamente'
            };
        } else {
            usuario = {
                nombre: req.body.nombre,
                apellido: req.body.apellido
            };
            respuesta = {
                error: false,
                codigo: 200,
                mensaje: 'Usuario creado',
                respuesta: usuario
            };
        }
    }

    res.send(respuesta);
});

app.put('/usuario', function (req, res) {
    if (!req.body.nombre || !req.body.apellido) {
        respuesta = {
            error: true,
            codigo: 502,
            mensaje: 'El campo nombre y apellido son requeridos'
        };
    } else {
        if (usuario.nombre === '' || usuario.apellido === '') {
            respuesta = {
                error: true,
                codigo: 501,
                mensaje: 'El usuario no ha sido creado'
            };
        } else {
            usuario = {
                nombre: req.body.nombre,
                apellido: req.body.apellido
            };
            respuesta = {
                error: false,
                codigo: 200,
                mensaje: 'Usuario actualizado',
                respuesta: usuario
            };
        }
    }

    res.send(respuesta);
});*/

app.use((req, res, next) => {
    respuesta = {
        error: true,
        codigo: 404,
        mensaje: 'URL no encontrada'
    };
    res.status(404).send(respuesta);
});

app.listen(3000, () => {
    console.log("El servidor está inicializado en el puerto 3000");
});