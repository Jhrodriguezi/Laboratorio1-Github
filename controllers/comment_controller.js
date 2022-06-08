const { Comment, functions_comment} = require('../models/comment');
const { User, functions_user} = require('../models/user');
const general_functions = require('./general_functions');

const comment_functions_controller = {
  agregarComment: async (req, res) => {
    let newComment  = new Comment(null, req.body.contenido, 0, 0, 0, null, true, req.body.idusuario, req.body.idreview);
    let result = [];
    try{
      await functions_comment.insertComment(newComment);
      result = await functions_comment.selectCommentsByIdReview(req.body.idreview);
      for(let i = 0; i<result.length; i++){
        result[i] = await checkDataComment(result[i]);
      }
    }catch(e){
      console.log(e);
    }
    res.send(result)
  }
}

async function checkDataComment(c){
  let user;
  try {
    user = (await functions_user.selectByIdUser(c.getIdUsuario))[0];
  }catch(e){
    console.log("movie_controller/checkDataComment - "+e);
  }
  c.nickname = user.getNickname;
  c.setFechaPub = general_functions.date_format(c.getFechaPub);
  return c;
}

module.exports = comment_functions_controller;