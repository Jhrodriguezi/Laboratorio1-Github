const express = require('express');
const app = express();
const session = require('express-session');
const conexion = require('./models/db');
const routes = require('./router/routes');

//Middleware para formatear los datos de entrada en json
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//Middleware para el uso de sesiones en express
app.use(session({
  secret: 'cambiar',
  resave: true,
  saveUninitialized:true
}))

app.use("/", routes);

app.use((req, res, next)=>{
  res.status(404).send("404",{
    titulo:"404",
    descripcion: "No existe el recurso"
  });
  next();
})

app.listen(3000, (req, res)=>{
  console.log("TODO CORRECTO");
})