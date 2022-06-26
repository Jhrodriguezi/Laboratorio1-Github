const { Log, functions_log } = require('../models/log');
const { Movie, functions_movie} = require('../models/movie');
const { User, functions_user} = require('../models/user');
const { Review, functions_review} = require('../models/review');

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
  },
  cargarHistorialResenas: async (req, res) => {
    if (req.session.loggedin) {
      if(req.session.role=="user"){
        let reviews, total_count;
        try{
          reviews = await functions_review.getAllReviewsByIdUser(req.session.idusuario);
          total_count = await functions_review.getAmountReactionsByIdUser(req.session.idusuario);
        }catch(err){
          console.log("controllers/main_controller/cargarHistorialResenas - "+err);
        }
        res.render("historial", {
          alert: false,
          alertTitle: "",
          alertMessage: "",
          alertIcon: 'error',
          showConfirmButton: true,
          ruta: '',
          login: true,
          name: req.session.name,
          reviews: reviews,
          total_count: total_count
        });
      }else{
        res.render("historial", {
          alert: true,
          alertTitle: "Error",
          alertMessage: "No tiene los permisos para acceder a este recurso",
          alertIcon: 'error',
          showConfirmButton: true,
          ruta: '',
          login: true,
          name: req.session.name,
          reviews: [],
          total_count: {}
        });
      }
    }else{
      res.render("historial", {
        alert: true,
        alertTitle: "Error",
        alertMessage: "Tiene que identificarse para acceder",
        alertIcon: 'error',
        showConfirmButton: true,
        ruta: '',
        login: false,
        name: "",
        reviews: [],
        total_count: {}
      });
    }
  },
  cargarTendencias: (req, res) => {
    res.render("tendencias");
  },
  cargarEstadisticasPelicula: (req, res) => {
    res.render("movie-statistics");
  },
  cargarTablaAdmin: async (req, res) => {
    if (req.session.loggedin) {
      if(req.session.role=="admin"){
        let users;
        try{
          users = await functions_user.selectAllUsersForTableAdmin();
        }catch(err){
          console.log("controllers/main_controller/cargarTablaAdmin - "+err);
        }
        res.render("admin-table", {
          alert: false,
          alertTitle: "",
          alertMessage: "",
          alertIcon: 'error',
          showConfirmButton: true,
          ruta: '',
          login: true,
          name: req.session.name,
          users: users
        });
      }else{
        res.render("admin-table", {
          alert: true,
          alertTitle: "Error",
          alertMessage: "No tiene los permisos para acceder a este recurso",
          alertIcon: 'error',
          showConfirmButton: true,
          ruta: '',
          login: true,
          name: req.session.name,
          users: undefined
        });
      }
    }else{
      res.render("admin-table", {
        alert: true,
        alertTitle: "Error",
        alertMessage: "Tiene que identificarse para acceder",
        alertIcon: 'error',
        showConfirmButton: true,
        ruta: '',
        login: false,
        name: "",
        users: undefined
      });
    }
  }
}

module.exports = main_functions;