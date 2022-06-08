const { Log, functions_log } = require('../models/log');

const main_functions = {
  cerrarSesion: (req, res) => {
    let log = new Log(null, req.session.name, null, 'N/A', null, 'Se ha cerrado sesión');
    console.log(log);
    functions_log.insertLog(log)
      .then(() => {
        req.session.destroy(() => {
          res.redirect('/');
        })
      }).catch(e => console.log(e))
  },
  cargarFormularioRegistro: (req, res) => {
    if (req.session.loggedin) {
      res.redirect('/home');
    } else {
      res.render("register");
    }
  },
  cargarFormularioLogin: (req, res) => {
    if (req.session.loggedin) {
      res.redirect('/home');
    } else {
      res.render("login");
    }
  },
  cargarFormularioResena: (req, res) => {
    if (req.session.loggedin) {
      res.render("resena-formulario", {
        login: true,
        name: req.session.name,
        idusuario: req.session.idusuario,
        idpelicula: req.query.id
      });
    } else {
      res.render("resena-formulario", {
        login: false,
        name: "??",
        alert: true,
        alertTitle: "Login requerido",
        alertMessage: "Debe identificarse para acceder a la pagina",
        alertIcon: 'info',
        showConfirmButton: true,
        timer: false,
        ruta: '',
        idusuario: null,
        idpelicula: null
      });
    }
  }
}

module.exports = main_functions;