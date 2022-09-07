const connection = require('./db');

class Comment{
  #id;
  #contenido;
  #likes;
  #dislikes;
  #denuncias;
  #fechapub;
  #visible;
  #idusuario;
  #idreview;

  constructor(id, contenido, likes, dislikes, denuncias,
              fechaPub, visible, idusuario, idreview) {
    this.id = id;
    this.contenido = contenido;
    this.likes = likes;
    this.dislikes = dislikes;
    this.denuncias = denuncias;
    this.fechapub = fechaPub;
    this.visible = visible;
    this.idusuario = idusuario;
    this.idreview = idreview;
  }

  get getId() {
    return this.id;
  }

  set setId(id) {
    this.id = id;
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
    return this.fechapub;
  }

  set setFechaPub(fechapub) {
    this.fechapub = fechapub;
  }

  get getVisible() {
    return this.visible;
  }

  set setVisible(visible) {
    this.visible = visible;
  }

  get getIdUsuario() {
    return this.idusuario;
  }

  set setIdUsuario(idusuario) {
    this.idusuario = idusuario;
  }

  get getIdReview() {
    return this.idreview;
  }

  set setIdReview(idreview) {
    this.idreview = idreview;
  }
}

const functions_comment = {
  insertComment: async (comment_object) => {
    try {
      let client = await connection.connect();
      let sql = "INSERT INTO comentario (contenido, likes, dislikes, denuncias, fechapub, visible, idusuario, idresena) values($1, $2, $3, $4, now(), TRUE, $5, $6)";
      let values = [comment_object.getContenido, comment_object.getLikes, comment_object.getDislikes, comment_object.getDenuncias, comment_object.getIdUsuario, comment_object.getIdReview];
      let result = await client.query(sql, values);
      client.release(true);
      return result;
    } catch (e) {
      console.log(e);
    }
  },
  selectCommentById: async (id) => {
    try {
      let client = await connection.connect();
      let sql = "SELECT * FROM comentario WHERE id=$1";
      let values = [id];
      let result = [];
      (await client.query(sql, values)).rows.forEach(element => {
        result.push(new Comment(element.id, element.contenido, element.likes, element.dislikes, element.denuncias, element.fechapub, element.visible, element.idusuario, element.idresena))
      });
      client.release(true);
      return result;
    } catch (e) {
      console.log(e);
    }
  },
  selectCommentsByIdReview: async (idReview) => {
    try {
      let client = await connection.connect();
      let sql = "SELECT * FROM comentario WHERE idresena=$1";
      let values = [idReview];
      let result = [];
      (await client.query(sql, values)).rows.forEach(element => {
        result.push(new Comment(element.id, element.contenido, element.likes, element.dislikes, element.denuncias, element.fechapub, element.visible, element.idusuario, element.idresena))
      });
      client.release(true);
      return result;
    } catch (e) {
      console.log(e);
    }
  },
  updateComment: async (comment_object) =>{
    try {
      let client = await connection.connect();
      let sql = "UPDATE comentario SET likes=$1, dislikes=$2, denuncias=$3 WHERE id=$4";      
      let values = [comment_object.getLikes, comment_object.getDislikes, comment_object.getDenuncias, comment_object.getId];
      let result = await client.query(sql, values);
      client.release(true);
      return result;
    } catch (e) {
      console.log(e);
    }
  },
  
}

module.exports = {Comment, functions_comment};