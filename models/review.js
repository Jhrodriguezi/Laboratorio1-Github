const connection = require('./db');

class Review {
  #id;
  #encabezado;
  #contenido;
  #likes;
  #dislikes;
  #denuncias;
  #fechapub;
  #puntuacion;
  #idusuario;
  #idpelicula;

  constructor(id, encabezado, contenido, likes, dislikes, denuncias, fechapub, puntuacion, idusuario, idpelicula){
    this.id = id;
    this.encabezado = encabezado;
    this.contenido = contenido;
    this.likes = likes;
    this.dislikes = dislikes;
    this.denuncias = denuncias;
    this.fechapub = fechapub;
    this.puntuacion = puntuacion;
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
  updateDenuncias: async (review_object) => {
    try {
      let client = await connection.connect();
      let sql = "UPDATE resena SET denuncias=$1 WHERE id=$2";
      let values = [review_object.getDenuncias + 1, review_object.getId];
      let result = await client.query(sql, values);
      console.log(result);
      client.release(true);
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
        result.push(new Review(element.id, element.encabezado, element.contenido, element.likes, element.dislikes, element.denuncias, element.fechapub, element.puntuacion, element.idusuario, element.idpelicula));
      });
      client.release(true);
      return result;
    } catch (e) {
      console.log(e);
    }
  },
  //temporal, el promedio deberia guardarse en la bd en la tabla movie.
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