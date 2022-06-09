const { Movie, functions_movie } = require('../models/movie');
const { Log, functions_log } = require('../models/log');
const { Review, functions_review } = require('../models/review');
const { User, functions_user } = require('../models/user');
const { Comment, functions_comment } = require('../models/comment');
const general_functions = require('./general_functions');

const movie_functions_controller = {
  cargarPelicula: async (req, res) => {
    let movie, newLog, reviews;
    if (req.session.loggedin) {
        try {
          movie = await functions_movie.peliculaById(req.query.id);
          reviews = await functions_review.getAllReviewsByIdMovie(Number(req.query.id));
          for (let i = 0; i < reviews.length; i++) {
            reviews[i] = await checkDataReview(reviews[i], req.session.name);
          }
          movie = await checkDataMovie(movie);
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
        movie,
        reviews,
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

  let result;

  try {
    result = await functions_movie.selectMovieById(movie.id);
    if (result.length > 0) {
      movie.vote_average = Math.round(result[0].getPuntuacion * 10) / 10;
      movie.num_reviews = result[0].getNresenas;
    } else {
      movie.vote_average = "-";
      movie.num_reviews = 0;
    }
  } catch (e) {
    console.log(e);
  }

  if (!movie.overview) {
    movie.overview = "-";
  }

  return movie;
}

async function checkDataReview(r, nickname) {
  let user;
  try {
    user = (await functions_user.selectByIdUser(r.getIdUsuario))[0];
    r.comments = await functions_comment.selectCommentsByIdReview(r.getId);
    for(let i = 0; i<r.comments.length; i++){
      r.comments[i] = await checkDataComment(r.comments[i], nickname)
    }
    let text = ["denunciado", "reaccionado con un like a", "reaccionado con un dislike a"];
    let propiedades = ["mostrarBotonDenuncia", "mostrarBotonLike", "mostrarBotonDislike"];
    let res;
    if(r.denuncias>=20){r.visible=false;}
    for (let i = 0; i < 3; i++) {
      res = await functions_log.selectByNicknameAndReactionsReviewLog(nickname, r.getId, text[i]);
      if (res.rowCount == 0) {
        r[propiedades[i]] = true;
      } else {
        r[propiedades[i]] = false;
      }
    }
  } catch (e) {
    console.log(e)
  }
  r.nickname = user.getNickname;
  r.setFechapub = general_functions.date_format(r.getFechapub);
  return r;
}

async function checkDataComment(c, nickname) {
  let user;
  try {
    user = (await functions_user.selectByIdUser(c.getIdUsuario))[0];
    let text = ["denunciado el", "reaccionado con un like al", "reaccionado con un dislike al"];
    let propiedades = ["mostrarBotonDenuncia", "mostrarBotonLike", "mostrarBotonDislike"];
    let res;
    if(c.denuncias>=20){c.visible=false;}
    for (let i = 0; i < 3; i++) {
      res = await functions_log.selectByNicknameAndReactionsCommentLog(nickname, c.getId, text[i]);
      if (res.rowCount == 0) {
        c[propiedades[i]] = true;
      } else {
        c[propiedades[i]] = false;
      }
    }
  } catch (e) {
    console.log("movie_controller/checkDataComment - " + e);
  }
  c.nickname = user.getNickname;
  c.setFechaPub = general_functions.date_format(c.getFechaPub);
  return c;
}

module.exports = movie_functions_controller;