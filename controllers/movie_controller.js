const { Movie, functions_movie } = require('../models/movie');
const { Log, functions_log } = require('../models/log');
/*const { Review, functions_review } = require('../models/review');
const { User, functions_user } = require('../models/user');
const { Comment, functions_comment } = require('../models/comment');
const general_functions = require('./general_functions');*/

const movie_functions_controller = {
  cargarPelicula: async (req, res) => {
    let movie, newLog, movies;
    if (req.session.loggedin) {
      try {
        movie = await functions_movie.peliculaById(req.query.id);
        movies = await functions_movie.selectAllMovies();
        movie = checkDataMovie(movie, movies);
      } catch (e) {
        console.log("movie_controller/cargarPelicula - " + e);
      }
      if (req.session.authorize_log_movie) {
        try {
          newLog = new Log(null, req.session.name, null, "Read movie", movie.id, 'El usuario ha consultado la pelicula: ' + movie.title);
          await functions_log.insertLog(newLog);
          req.session.authorize_log_movie = false;
        } catch (e) {
          console.log(e);
        }
        console.log(newLog);
      }
      res.render("movie", {
        login: true,
        name: req.session.name,
        idusuario: req.session.idusuario,
        role: req.session.role,
        movie
      });
    } else {
      res.render("intermedio", {
        login: false,
        name: "??",
        alert: true,
        alertTitle: "Login requerido",
        alertMessage: "Debe identificarse para acceder a la pagina",
        alertIcon: 'info',
        showConfirmButton: true,
        timer: false,
        ruta: '',
        idusuario: -1,
        movie
      });
    }
  },
  obtenerPeliculasPorNombre: async (req, res) => {
    let movies;
    try {
      movies = await functions_movie.buscar(req.query.name);
    } catch (e) {
      console.log(e);
    }
    res.send(movies);
  },
  obtenerPeliculasPopulares: async (req, res) => {
    let movies;
    try {
      movies = await functions_movie.masPopulares();
    } catch (e) {
      console.log(e)
    }
    res.send(movies);
  }
}
//---------------------------------------------------------------------
//FUNCIONES AUXILIARES

function checkDataMovie(movie, movies) {
  if (!movie.title) {
    movie.title = "??";
  }

  if (movie.poster_path) {
    movie.poster_path = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
  } else {
    movie.poster_path = "/resources/img/imagen_no_disponible.png";
  }
  if (!movie.original_language) {
    movie.original_language = "-";
  }

  if (movie.genres.length > 0) {
    let string = "";
    let flag = true;
    movie.genres.forEach(genre => {
      if (flag) {
        string += genre.name;
        flag = false;
      } else {
        string += ", " + genre.name;
      }
    })
    movie.genres = string;
  } else {
    movie.genres = "-";
  }

  if (!movie.original_title) {
    movie.original_title = "-";
  }

  if (!movie.release_date) {
    movie.release_date = "-";
  }

  if (movies[movie.id] != undefined) {
    movie.vote_average = Math.round(movies[movie.id].getPuntuacion * 10) / 10;
    movie.num_reviews = movies[movie.id].getNresenas;
  } else {
    movie.vote_average = "-";
    movie.num_reviews = 0;
  }
  if (!movie.overview) {
    movie.overview = "-";
  }
  return movie;
}

module.exports = movie_functions_controller;