//const { Router } = require('express');
const express = require('express');
const routes = express.Router();
const path = require('path');
const user_controller = require('../controllers/user_controller');
const main_controller = require('../controllers/main_controller');
const movie_controller = require('../controllers/movie_controller');

routes.get("/", main_controller.cargarFormularioLogin);
routes.get('/home', user_controller.verificarLogin);
routes.get("/register-form", main_controller.cargarFormularioRegistro);
routes.get('/logout', main_controller.cerrarSesion);
routes.get('/search', movie_controller.cargarPelicula);

routes.post("/register", user_controller.registrarUsuario);
routes.post("/auth", user_controller.loginUser);

module.exports = routes;