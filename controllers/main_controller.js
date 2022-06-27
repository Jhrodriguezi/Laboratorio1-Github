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
        name: req.session.name,
        role: req.session.role
      });
    } else {
      res.render("grid", {
        login: false,
        name: "??",
        role: "??",
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
    if (req.session.loggedin) {
      if(req.session.role=="analyst"){
        res.render("tendencias", {
          login: true,
          name: req.session.name,
          alert:false,
        });
      }else{
        res.render("tendencias", {
          alert: true,
          alertTitle: "Error",
          alertMessage: "No tiene los permisos para acceder a este recurso",
          alertIcon: 'error',
          showConfirmButton: true,
          ruta: '',
          login: true,
          name: req.session.name,
        });
      }
    }else{
      res.render("tendencias", {
        alert: true,
        alertTitle: "Error",
        alertMessage: "Tiene que identificarse para acceder",
        alertIcon: 'error',
        showConfirmButton: true,
        ruta: '',
        login: false,
        name:'',
      });
    }
  },
  cargarEstadisticasPelicula: async (req, res) => {
    if (req.session.loggedin) {
      if(req.session.role=="analyst"){
        let moda={}, media={}, mediana={}, movie_name;
        try{
          moda = await functions_review.getModaByIdMovie(req.query.idmovie);
          mediana = await functions_review.getMedianaByIdMovie(req.query.idmovie);
          media = await functions_review.getMediaByIdMovie(req.query.idmovie);
          movie_name = req.query.name_movie;
        }catch(err){
          console.log("controllers/main_controller/cargarEstadisticasPelicula - "+err);
        }
        res.render("movie-statistics", {
          alert: false,
          alertTitle: "",
          alertMessage: "",
          alertIcon: 'error',
          showConfirmButton: true,
          ruta: '',
          login: true,
          name: req.session.name,
          movie_name: movie_name,
          id_movie: req.query.idmovie,
          moda,
          media,
          mediana,
        });
      }else{
        res.render("movie-statistics", {
          alert: true,
          alertTitle: "Error",
          alertMessage: "No tiene los permisos para acceder a este recurso",
          alertIcon: 'error',
          showConfirmButton: true,
          ruta: '',
          login: true,
          name: req.session.name,
          id_movie: req.query.idmovie,
          movie_name: '',
          moda: {},
          media: {},
          mediana: {},
        });
      }
    }else{
      res.render("movie-statistics", {
        alert: true,
        alertTitle: "Error",
        alertMessage: "Tiene que identificarse para acceder",
        alertIcon: 'error',
        showConfirmButton: true,
        ruta: '',
        login: false,
        name: "",
        id_movie: req.query.idmovie,
        movie_name: '',
        moda: {},
        media: {},
        mediana: {},
      });
    }
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
  },
  obtenerDatosTendencia: async (req, res) => {
    let data = {};
    try{
      data['data_sesiones'] = await functions_log.selectAllLogIn();
      data['data_busquedas'] = await functions_log.selectAllSearches();
      data['data_reseñas'] = await functions_log.selectAllInsertReviews();
    }catch(err){
      console.log('controllers/main_controller - '+err);
    }
    res.status(200).send(data);
  }
}

module.exports = main_functions;