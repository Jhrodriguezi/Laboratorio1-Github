const { Log, functions_log } = require('../models/log');
const { Movie, functions_movie} = require('../models/movie');

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
  cargarFormularioResena: async (req, res) => {
    if (req.session.loggedin) {
      let movie = await functions_movie.peliculaById(req.query.id);
      res.render("resena-formulario", {
        login: true,
        name: req.session.name,
        idusuario: req.session.idusuario,
        idpelicula: req.query.id,
        movie_name: movie.title
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
        idpelicula: null,
        movie_name: null
      });
    }
  },
  cargarHome: (req, res) => {
    if (req.session.loggedin) {
      req.session.authorize_log_movie = true;
      res.render("grid", {
        login: true,
        name: req.session.name
      });
    } else {
      res.render("grid", {
        login: false,
        name: "??",
        alert: true,
        alertTitle: "Login requerido",
        alertMessage: "Debe identificarse para acceder a la pagina",
        alertIcon: 'info',
        showConfirmButton: true,
        timer: false,
        ruta: ''
      });
    }
  }
}

module.exports = main_functions;