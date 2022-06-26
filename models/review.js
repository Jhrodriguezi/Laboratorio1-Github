const connection = require('./db');
const general_functions = require('../controllers/general_functions');

class Review {
  #id;
  #encabezado;
  #contenido;
  #likes;
  #dislikes;
  #denuncias;
  #fechapub;
  #puntuacion;
  #visible;
  #idusuario;
  #idpelicula;

  constructor(id, encabezado, contenido, likes, dislikes, denuncias, fechapub, puntuacion, visible, idusuario, idpelicula){
    this.id = id;
    this.encabezado = encabezado;
    this.contenido = contenido;
    this.likes = likes;
    this.dislikes = dislikes;
    this.denuncias = denuncias;
    this.fechapub = fechapub;
    this.puntuacion = puntuacion;
    this.visible = visible;
    this.idusuario = idusuario;
    this.idpelicula = idpelicula;
  }

  get getId() {
    return this.id;
  }

  /**
     * @param {any} id
     */
  set setId(id) {
    this.id = id;
  }

  get getEncabezado() {
    return this.encabezado;
  }

  /**
     * @param {any} encabezado
     */
  set setEncabezado(encabezado) {
    this.encabezado = encabezado;
  }

  get getContenido() {
    return this.contenido;
  }

  /**
     * @param {any} contenido
     */
  set setContenido(contenido) {
    this.contenido = contenido;
  }

  get getLikes() {
    return this.likes;
  }

  /**
     * @param {any} likes
     */
  set setLikes(likes) {
    this.likes = likes;
  }

  get getDislikes() {
    return this.dislikes;
  }

  /**
     * @param {any} dislikes
     */
  set setDislikes(dislikes) {
    this.dislikes = dislikes;
  }

  get getDenuncias() {
    return this.denuncias;
  }

  /**
     * @param {any} denuncias
     */
  set setDenuncias(denuncias) {
    this.denuncias = denuncias;
  }

  get getFechapub() {
    return this.fechapub;
  }

  /**
     * @param {any} fechapub
     */
  set setFechapub(fechapub) {
    this.fechapub = fechapub;
  }

  get getPuntuacion() {
    return this.puntuacion;
  }

  /**
     * @param {any} puntuacion
     */
  set setPuntuacion(puntuacion) {
    this.puntuacion = puntuacion;
  }

  get getVisible() {
    return this.visible;
  }


  get getIdUsuario() {
    return this.idusuario;
  }

  /**
     * @param {any} idusuario
     */
  set setIdUsuario(idusuario) {
    this.idusuario = idusuario;
  }

  get getIdPelicula() {
    return this.idpelicula;
  }

  /**
     * @param {any} idpelicula
     */
  set setIdPelicula(idpelicula) {
    this.idpelicula = idpelicula;
  }
  
}

const functions_review = {
  insertReview: async (review_object)=>{
    try {
      let client = await connection.connect();
      let sql = "INSERT INTO resena (encabezado, contenido, likes, dislikes, denuncias, fechapub, puntuacion, visible, idusuario, idpelicula) values($1, $2, $3, $4, $5, now(), $6, TRUE, $7, $8)";
      let values = [review_object.getEncabezado, review_object.getContenido, review_object.getLikes, review_object.getDislikes, review_object.getDenuncias, review_object.getPuntuacion, review_object.getIdUsuario, review_object.getIdPelicula];
      let result = await client.query(sql, values);
      client.release(true);
      return result;
    } catch (e) {
      console.log(e);
    }
  },
  updateReview: async (review_object) => {
    try {
      let client = await connection.connect();
      let sql = "UPDATE resena SET likes=$1, dislikes=$2, denuncias=$3 WHERE id=$4";
      let values = [review_object.getLikes, review_object.getDislikes, review_object.getDenuncias, review_object.getId];
      await client.query(sql, values);
      client.release(true);
    } catch (e) {
      console.log(e);
    }
  },
  updateReviewC: async (review_object) => {
    try {
      let client = await connection.connect();
      let sql = "UPDATE resena SET denuncias=$1 WHERE id=$2";
      let values = [review_object.getDenuncias, review_object.getId];
      await client.query(sql, values);
      client.release(true);
    } catch (e) {
      console.log(e);
    }
  },
  selectByIdReview: async (id) => {
    try {
      let client = await connection.connect();
      let sql = "SELECT * FROM resena WHERE id=$1";
      let values = [id];
      let result = [], resp;
      resp = await client.query(sql, values);
      resp.rows.forEach(element => {
        result.push(new Review(element.id, element.encabezado, element.contenido, element.likes, element.dislikes, element.denuncias, element.fechapub, element.puntuacion, element.visible, element.idusuario, element.idpelicula));
      });
      client.release(true);
      return result;
    } catch (e) {
      console.log(e);
    }
  },
  getAllReviewsByIdMovie: async (idpelicula)=>{
    try {
      let client = await connection.connect();
      let sql = "SELECT * FROM resena WHERE idpelicula=$1";
      let values = [idpelicula];
      let result = [], resp;
      resp = await client.query(sql, values);
      resp.rows.forEach(element => {
        result.push(new Review(element.id, element.encabezado, element.contenido, element.likes, element.dislikes, element.denuncias, element.fechapub, element.puntuacion, element.visible, element.idusuario, element.idpelicula));
      });
      client.release(true);
      return result;
    } catch (e) {
      console.log(e);
    }
  },
  getAllReviewsByIdUser: async (iduser)=>{
    try {
      let client = await connection.connect();
      let sql = "SELECT R.id, R.encabezado, R.fechapub, R.contenido, R.likes, R.dislikes, R.puntuacion, P.name as movie_name FROM resena R INNER JOIN pelicula P on R.idpelicula = P.id where R.idusuario=$1";
      let values = [iduser];
      let result = [], resp, resp_comment, count={};
      resp = await client.query(sql, values);
      sql = "SELECT idresena, count(*) as num_comments FROM comentario group by idresena";
      resp_comment = await client.query(sql);
      resp_comment.rows.forEach(element => {
        count[element.idresena] = element.num_comments;
      });
      resp.rows.forEach(element => {
        element.fechapub = general_functions.date_format(element.fechapub);
        if(count[element.id]){
          element['num_comments'] = count[element.id];
        }else{
          element['num_comments'] = 0;
        }
        result.push(element);
      });
      client.release(true);
      return result;
    } catch (e) {
      console.log("models/review/getAllReviewsByIdUser - "+e);
    }
  },

  getAmountReactionsByIdUser: async (iduser) => {
    try{
      let client = await connection.connect();
      let sql = "SELECT SUM(likes) as total_likes, SUM(dislikes) as total_dislikes from resena where idusuario=$1";
      let values = [iduser]
      let resp, result= {};
      resp = await client.query(sql,values);
      result['total_reactions'] = Number(resp.rows[0].total_likes) + Number(resp.rows[0].total_dislikes);
      sql = "SELECT COUNT(*) as total_comments from resena R INNER JOIN comentario C on C.idresena = R.id where R.idusuario = $1;"
      resp = await client.query(sql,values);
      result['total_comments'] = resp.rows[0].total_comments;
      client.release(true);
      return result;
    }catch(e){
      console.log("models/review/getAmountReactionsByIdUser - "+e);
    }
    
  },
  
  getCountReviewsByIdMovie: async (idpelicula) =>{
    try {
      let client = await connection.connect();
      let sql = "SELECT count(*) as count FROM resena WHERE idpelicula=$1";
      let values = [idpelicula];
      let result, resp;
      resp = await client.query(sql, values);
      resp.rows.forEach(element => {
        result = element.count;
      });
      client.release(true);
      return result;
    } catch (e) {
      console.log(e);
    }
  },
  getAverageMovie: async (idpelicula)=>{
    try {
      let client = await connection.connect();
      let sql = "SELECT avg(puntuacion) as average FROM resena WHERE idpelicula=$1";
      let values = [idpelicula];
      let result, resp;
      resp = await client.query(sql, values);
      resp.rows.forEach(element => {
        result= element.average;
      });
      client.release(true);
      return result;
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = { Review, functions_review };