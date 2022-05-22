const express = require('express');
const app = express();
const session = require('express-session');
const conexion = require('./models/db');
const routes = require('./router/routes');
const path = require('path');

//Middleware para formatear los datos de entrada en json
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//Middleware para lectura de archivos estaticos
app.use('/resources', express.static(path.resolve(__dirname+'/public')));

//Middleware para el uso de sesiones en express
app.use(session({
  secret: 'cambiar',
  resave: true,
  saveUninitialized:true
}))

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname+"/views"))

app.use(session({
  secret: "cambiar",
  resave: true,
  saveUninitialized: true
}));

app.use(routes);

app.use((req, res, next)=>{
  res.status(404).render("404");
})

app.listen(3000, (req, res)=>{
  console.log("TODO CORRECTO");
})