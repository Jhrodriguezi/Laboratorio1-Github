const { Comment, functions_comment } = require('../models/comment');
const { User, functions_user } = require('../models/user');
const { Log, functions_log } = require('../models/log');
const general_functions = require('./general_functions');

const comment_functions_controller = {
  agregarComment: async (req, res) => {
    let newComment = new Comment(null, req.body.contenido, 0, 0, 0, null, true, req.body.idusuario, req.body.idreview);
    try {
      await functions_comment.insertComment(newComment);
    } catch (e) {
      console.log(e);
    }
    res.status(200).send();
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
  },

  obtenerCommentsByIdReview: async (req, res) => {
    let comments, logs, users;
    try {
      users = await functions_user.selectAllUsers();
      comments = await functions_comment.selectCommentsByIdReview(req.query.idreview);
      logs = await functions_log.selectByNicknameAndReactionsCommentLog(req.session.name, req.query.idmovie);
      for (let i = 0; i < comments.length; i++) {
        comments[i] = checkDataComment(comments[i], logs, users);
      }
    } catch (e) {
      console.log("review_controller/obtenerCommentsByIdReview - " + e);
    }
    res.status(200).send(comments);
  }
}

function checkDataComment(c, logs, users) {
  let text = ["denunciado el", "reaccionado con un like al ", "reaccionado con un dislike al"];
  let propiedades = ["mostrarBotonDenuncia", "mostrarBotonLike", "mostrarBotonDislike"];
  
  if (c.denuncias >= 20) { c.visible = false; }
  
  c[propiedades[0]] = true;
  c[propiedades[1]] = true;
  c[propiedades[2]] = true;

  for (let i = 0; i < logs.length; i++) {
    if (logs[i].accion.includes(text[0]) && logs[i].accion.includes(c.id)) {
      c[propiedades[0]] = false;
    }
    if ((logs[i].accion.includes(text[1]) || logs[i].accion.includes(text[2])) && logs[i].accion.includes(c.id)) {
      c[propiedades[1]] = false;
      c[propiedades[2]] = false;
    }
  }
  c.nickname = users[c.getIdUsuario].getNickname;
  c.setFechaPub = general_functions.date_format(c.getFechaPub);
  return c;
}

module.exports = comment_functions_controller;