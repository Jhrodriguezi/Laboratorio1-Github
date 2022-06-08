const connection = require('./db');

class Comment{
  #id;
  #contenido;
  #likes;
  #dislikes;
  #denuncias;
  #fechaPub;
  #visible;
  #idUsuario;
  #idReseña;

  constructor(id, contenido, likes, dislikes, denuncias,
              fechaPub, visible, idUsuario, idReseña) {
    this.id = id;
    this.contenido = contenido;
    this.likes = likes;
    this.dislikes = dislikes;
    this.denuncias = denuncias;
    this.fechaPub = fechaPub;
    this.visible = visible;
    this.idUsuario = idUsuario;
    this.idReseña = idReseña;
  }

  get getId() {
    return this.id;
  }

  set setContenido(id) {
    this.contenido = contenido;
  }

  get getContenido() {
    return this.contenido;
  }

  set setContenido(contenido) {
    this.contenido = contenido;
  }

  get getLikes() {
    return this.likes;
  }

  set setLikes(likes) {
    this.likes = likes;
  }
  
  get getDislikes() {
    return this.dislikes;
  }

  set setDislikes(dislikes) {
    this.dislikes = dislikes;
  }

  get getDenuncias() {
    return this.denuncias;
  }

  set setDenuncias(denuncias) {
    this.denuncias = denuncias;
  }

  get getFechaPub() {
    return this.fechaPub;
  }

  set setFechaPub(fechaPub) {
    this.fechaPub = fechaPub;
  }

  get getVisible() {
    return this.visible;
  }

  set setVisible(visible) {
    this.visible = visible;
  }

  get getIdUsuario() {
    return this.idUsuario;
  }

  set setIdUsuario(idUsuario) {
    this.idUsuario = idUsuario;
  }

  get getIdReseña() {
    return this.idReseña;
  }

  set setIdReseña(idReseña) {
    this.idReseña = idReseña;
  }
}

const functions_comment = {
  insertComment: async (comment_object) => {
    try {
      let client = await connection.connect();
      let sql = "INSERT INTO comentario (contenido, likes, dislikes, denuncias, fechaPub, visible, idUsuario, idReseña) values($1, $2, $3, $4, $5, $6, $7, $8)";
      let values = [comment_object.getContenido, comment_object.getLikes, comment_object.getDislikes, comment_object.getDenuncias, comment_object.getFechaPub, comment_object.getVisible, comment_object.getIdUsuario, comment_object.getIdReseña];
      let result = await client.query(sql, values);
      client.release(true);
      return result;
    } catch (e) {
      console.log(e);
    }
  },
  SelectCommentById: async (id) => {
    try {
      let client = await connection.connect();
      let sql = "SELECT * FROM comentario WHERE id=$1";
      let values = [id];
      let result = await client.query(sql, values);
      client.release(true);
      return result;
    } catch (e) {
      console.log(e);
    }
  },
  SelectCommentsByReviewId: async (idReseña) => {
    try {
      let client = await connection.connect();
      let sql = "SELECT * FROM comentario WHERE idReseña=$1";
      let values = [idReseña];
      let result = await client.query(sql, values);
      client.release(true);
      return result;
    } catch (e) {
      console.log(e);
    }
  },
  updateComment: async (comment_object) =>{
    try {
      let client = await connection.connect();
      let sql = "UPDATE comentario SET contenido=$1, likes=$2, dislikes=$3, denuncias=$4, fechaPub=$5, visible=$6, idUsuario=$7, idReseña=$8 WHERE id=$9";      
      let values = [comment_object.getContenido, comment_object.getLikes, comment_object.getDislikes, comment_object.getDenuncias, comment_object.getFechaPub, comment_object.getVisible, comment_object.getIdUsuario, comment_object.getIdReseña, comment_object.getId];
      let result = await client.query(sql, values);
      client.release(true);
      return result;
    } catch (e) {
      console.log(e);
    }
  },
  
}

module.exports = {Comment, functions_comment};