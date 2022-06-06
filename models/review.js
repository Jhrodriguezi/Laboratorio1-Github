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
  }
}

module.exports = { Review, functions_review };