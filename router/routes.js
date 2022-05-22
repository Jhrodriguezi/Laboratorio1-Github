//const { Router } = require('express');
const express = require('express');
const routes = express.Router();
const path = require('path');
const user_controller = require('../controllers/user_controller');
const main_controller = require('../controllers/main_controller');

routes.get("/", user_controller.verificarLogin);
routes.get('/login-form', main_controller.cargarFormularioLogin);
routes.get("/register-form", main_controller.cargarFormularioRegistro);
routes.get('/logout', main_controller.cerrarSesion);
routes.post("/register", user_controller.registrarUsuario);
routes.post("/auth", user_controller.loginUser);

module.exports = routes;