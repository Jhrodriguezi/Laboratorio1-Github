const { Comment, functions_comment } = require('../models/comment');
const { User, functions_user } = require('../models/user');
const { Log, functions_log } = require('../models/log');
const general_functions = require('./general_functions');

const comment_functions_controller = {
  agregarComment: async (req, res) => {
    let newComment = new Comment(null, req.body.contenido, 0, 0, 0, null, true, req.body.idusuario, req.body.idreview);
    let result = [];
    try {
      await functions_comment.insertComment(newComment);
      result = await functions_comment.selectCommentsByIdReview(req.body.idreview);
      for (let i = 0; i < result.length; i++) {
        result[i] = await checkDataComment(result[i], req.session.name);
      }
    } catch (e) {
      console.log(e);
    }
    res.send(result);
  },
  actualizarComment: async (req, res) => {
    let com = new Comment(req.body.idcomment, null, req.body.likes, req.body.dislikes, req.body.denuncias, null, null, null, null);
    let action;
    switch (req.body.opcion) {
      case "denuncias":
        action = "El usuario ha denunciado el comentario: " + req.body.idcomment;
        break;
      case "likes":
        action = "El usuario ha reaccionado con un like al comentario: " + req.body.idcomment;
        break;
      case "dislikes":
        action = "El usuario ha reaccionado con un dislike al comentario: " + req.body.idcomment;
        break;
      default:
        action = "";
    }
    let newLog = new Log(null, req.session.name, null, "Update table comment; aumento de los contadores", req.body.idpelicula, action);
    try {
      await functions_comment.updateComment(com);
      await functions_log.insertLog(newLog);
    } catch (e) {
      console.log("review_controller/actualizarReview - " + e);
    }
    res.status(200).send();
  }
}

async function checkDataComment(c, nickname) {
  let user;
  try {
    user = (await functions_user.selectByIdUser(c.getIdUsuario))[0];
    let text = ["denunciado el", "reaccionado con un like al", "reaccionado con un dislike al"];
    let propiedades = ["mostrarBotonDenuncia", "mostrarBotonLike", "mostrarBotonDislike"];
    let res;
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

module.exports = comment_functions_controller;