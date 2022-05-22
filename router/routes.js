//const { Router } = require('express');
const express = require('express');
const routes = express.Router();
const path = require('path');
const user_controller = require('../controllers/user_controller');

routes.get("/", (req, res)=>{
    if(req.session.loggedin){
        res.render("grid", {
            login: true,
            name: req.session.name
        });
    }else{
        res.render("grid", {
            login: false,
            name: "??"
        });
    }
        
    }
);

routes.get('/login-form', (req, res)=>{
        res.render("login");
    }
);

routes.get("/register-form", (req, res)=>{
    res.render("register");
}
);

routes.get('/logout', (req, res) =>{
    req.session.destroy(() => {
        res.redirect('/');
    })
});

routes.post("/register", user_controller.registrarUsuario);
routes.post("/auth", user_controller.loginUser);

module.exports = routes;