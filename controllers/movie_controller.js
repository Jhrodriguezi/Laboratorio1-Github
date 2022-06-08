const { Movie, functions_movie } = require('../models/movie');
const { Log, functions_log } = require('../models/log');
const { Review, functions_review } = require('../models/review');
const { User, functions_user } = require('../models/user');
const { Comment, functions_comment} = require('../models/comment');

async function checkDataMovie(movie) {
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

  let average;

  try {
    average = await functions_review.getAverageMovie(movie.id);
    average = Math.round(average);
  } catch (e) {
    console.log(e);
  }

  if (!average) {
    average = "-";
  }

  movie.vote_average = average;
  if (!movie.num_reviews) {
    movie.num_reviews = 0;
  }

  if (!movie.overview) {
    movie.overview = "-";
  }

  return movie;
}

async function checkDataReview(r) {
  let user;
  try {
    user = (await functions_user.selectByIdUser(r.getIdUsuario))[0];
  } catch (e) {
    console.log(e)
  }
  r.setIdUsuario = user.getNickname;
  r.setFechapub = r.getFechapub.getDate() + "/" + (r.getFechapub.getMonth() + 1) + "/" + r.getFechapub.getFullYear();
  r.comments = [{contenido:"askdjasdkñlas", fechapub:"07/06/2022", idusuario: "jhrodriguezi", likes:1, dislikes: 2, denuncias: 5}]
  return r;
}


const movie_functions_controller = {
  cargarPelicula: async (req, res) => {
    let movie, newLog, reviews;
    try {
      movie = await functions_movie.peliculaById(req.query.id);
      reviews = await functions_review.getAllReviewsByIdMovie(Number(req.query.id));
      for (let i = 0; i < reviews.length; i++) {
        reviews[i] = await checkDataReview(reviews[i]);
      }
      movie.num_reviews = reviews.length;
      movie = await checkDataMovie(movie);
    } catch (e) {
      console.log(reviews, req.query, "AAAAAAAAAAAAAAAAAAAAA")
      console.log("ERRORRR EN LA CONSULTA");
    }
    if (req.session.loggedin) {
      if (req.query.flag) {
        try {
          newLog = new Log(null, req.session.name, null, "Read movie", movie.id, 'El usuario ha consultado la pelicula: ' + movie.title);
          await functions_log.insertLog(newLog);
          req.query.flag = false;
        } catch (e) {
          console.log(e);
        }
        console.log(newLog);
      }
      res.render("movie", {
        login: true,
        name: req.session.name,
        movie,
        reviews,
      });
    } else {
      res.render("movie", {
        login: false,
        name: "??",
        alert: true,
        alertTitle: "Login requerido",
        alertMessage: "Debe identificarse para acceder a la pagina",
        alertIcon: 'info',
        showConfirmButton: true,
        timer: false,
        ruta: '',
        movie,
        reviews,
      });
    }
    //res.send(movie);
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

module.exports = movie_functions_controller;