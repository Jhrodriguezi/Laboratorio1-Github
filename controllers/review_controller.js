const { Review, functions_review } = require('../models/review');
const { Log, functions_log } = require('../models/log');
const { Movie, functions_movie } = require('../models/movie');
const { User, functions_user } = require('../models/user');
const general_functions = require('./general_functions');

const review_functions_controller = {
  agregarReview: async (req, res) => {
    let newReview = new Review(null, req.body.titulo, req.body.contenido, 0, 0, 0, null, req.body.calificacion, true, req.body.idusuario, req.body.idpelicula);
    let newMovie, result, nresenas, puntuacion;
    try {
      let rm = (await functions_movie.selectMovieById(req.body.idpelicula)).length;
      if (rm == 0) {
        newMovie = new Movie(req.body.idpelicula, 0, 0);
        await functions_movie.insertMovie(newMovie);
      }
      result = await functions_review.insertReview(newReview);
      nresenas = await functions_review.getCountReviewsByIdMovie(req.body.idpelicula);
      puntuacion = await functions_review.getAverageMovie(req.body.idpelicula);
      newMovie = new Movie(req.body.idpelicula, puntuacion, nresenas);
      await functions_movie.updateMovie(newMovie);
    } catch (err) {
      result = undefined;
      console.log("review_controller/agregarReview - " + err);
      res.render("intermedio", {
        alert: true,
        alertTitle: "Error",
        alertMessage: "No se pudo registrar la reseña, intente nuevamente.",
        alertIcon: 'error',
        showConfirmButton: true,
        timer: false,
        ruta: 'resena-form'
      });
    }
    if (result) {
      if (result.rowCount == 1) {
        try {
          let log = new Log(null, req.session.name, null, 'Insert review', newReview.getIdPelicula, 'El usuario ha reseñado una pelicula');
          await functions_log.insertLog(log);
        } catch (e) {
          console.log(e);
        }
        res.render("intermedio", {
          alert: true,
          alertTitle: "Registro exitoso",
          alertMessage: "¡Se ha registrado la reseña!",
          alertIcon: 'success',
          showConfirmButton: false,
          timer: 3500,
          ruta: 'search?id=' + newReview.getIdPelicula
        });
      }
    }
  },


  actualizarReview: async (req, res) => {
    //hacer la validacion previa a la actualizacion (del log)
    let rev = new Review(req.body.idreview, null, null, req.body.likes, req.body.dislikes, req.body.denuncias, null, null, null, null, null);
    let action;
    switch (req.body.opcion) {
      case "denuncias":
        action = "El usuario ha denunciado la reseña: " + req.body.idreview;
        break;
      case "likes":
        action = "El usuario ha reaccionado con un like a la reseña: " + req.body.idreview;
        break;
      case "dislikes":
        action = "El usuario ha reaccionado con un dislike a la reseña: " + req.body.idreview;
        break;
      default:
        action = "";
    }
    let newLog = new Log(null, req.session.name, null, "Update table review; aumento de los contadores", req.body.idpelicula, action);
    try {
      await functions_review.updateReview(rev);
      await functions_log.insertLog(newLog);
    } catch (e) {
      console.log("review_controller/actualizarReview - " + e);
    }
    res.status(200).send();
  },


  obtenerReviewsByIdMovie: async (req, res) => {
    let reviews, users, logs;
    try {
      reviews = await functions_review.getAllReviewsByIdMovie(req.query.idmovie);
      users = await functions_user.selectAllUsers();
      logs = await functions_log.selectByNicknameAndReactionsReviewLog(req.session.name, req.query.idmovie);
      for (let i = 0; i < reviews.length; i++) {
        reviews[i] = checkDataReview(reviews[i], logs, users);
      }
    } catch (e) {
      console.log("review_controller/obtenerReviewsByIdMovie - " + e);
    }
    res.send(reviews);
  }
};

//----------------------------------------------------------------------
//FORMATEAR LOS DATOS PARA LA SALIDA EN EL FRONT
function checkDataReview(r, logs, users) {
  let text = ["denunciado", "reaccionado con un like a", "reaccionado con un dislike a"];
  let propiedades = ["mostrarBotonDenuncia", "mostrarBotonLike", "mostrarBotonDislike"];
  if (r.denuncias >= 20) { r.visible = false; }

  r[propiedades[0]] = true;
  r[propiedades[1]] = true;
  r[propiedades[2]] = true;

  for (let i = 0; i < logs.length; i++) {
    if (logs[i].accion.includes(text[0]) && logs[i].accion.includes(r.id)) {
      r[propiedades[0]] = false;
    }
    if ((logs[i].accion.includes(text[1]) || logs[i].accion.includes(text[2])) && logs[i].accion.includes(r.id)) {
      r[propiedades[1]] = false;
      r[propiedades[2]] = false;
    }
  }
  r.nickname = users[r.idusuario].getNickname;
  r.setFechapub = general_functions.date_format(r.getFechapub);
  return r;
}


module.exports = review_functions_controller;
