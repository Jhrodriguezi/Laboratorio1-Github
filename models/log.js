const connection = require('./db_log');

class Log {
  #id
  #nickname;
  #fecha;
  #operacion;
  #idpelicula;
  #accion;

  constructor(id, nickname, fecha, operacion, idpelicula, accion) {
    this.id = id;
    this.nickname = nickname;
    this.fecha = fecha;
    this.operacion = operacion;
    this.idpelicula = idpelicula;
    this.accion = accion;
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

  get getNickname() {
    return this.nickname;
  }

  /**
   * @param {string} nickname
   */
  set setNickname(nickname) {
    this.nickname = nickname;
  }

  get getFecha() {
    return this.fecha;
  }

  /**
   * @param {string} fecha
   */
  set setFecha(fecha) {
    this.fecha = fecha;
  }

  get getOperacion() {
    return this.operacion;
  }

  /**
   * @param {string} operacion
   */
  set setOperacion(operacion) {
    this.operacion = operacion;
  }

  get getIdpelicula() {
    return this.idpelicula;
  }

  /**
   * @param {any} idpelicula
   */
  set setIdpelicula(idpelicula) {
    this.idpelicula = idpelicula;
  }

  get getAccion() {
    return this.accion;
  }

  /**
   * @param {any} action
   */
  set setAction(action) {
    this.action = action;
  }
}

const functions_log = {
  //Inserta un registro en la tabla Log
  insertLog: async (log_object) => {
    let res;
    if (log_object.getNickname && log_object.getOperacion && log_object.getAccion) {
      let client = await connection.connect();
      let sql = "INSERT INTO log (usuario, fecha, operacion, idpelicula, accion) VALUES ($1, now(), $2, $3, $4)";
      let values = [log_object.getNickname, log_object.getOperacion, log_object.getIdpelicula, log_object.getAccion];
      res = await client.query(sql, values);
      client.release(true);
    } else {
      throw new Error('No están todos los datos necesarios para hacer la insercion en la tabla log');
    }
    return res;
  },

  selectAllLogs: async () => {
    let client = await connection.connect();
    let sql = "SELECT * FROM log";
    let result = []
    let res = await client.query(sql);
    res.rows.forEach(element => {
      result.push(new Log(element.id, element.usuario, element.fecha, element.operacion, element.idpelicula, element.accion));
    });
    client.release(true);
    return result;
  },

  selectByNicknameAndReactionsReviewLog: async (nickname, idmovie) => {
    try {
      let client = await connection.connect();
      let sql = "SELECT * FROM log WHERE usuario= $1 and idpelicula=$2 and operacion LIKE 'Update table review; aumento de los contadores'";
      let values = [nickname, idmovie];
      let resultQuery = await client.query(sql, values);
      let result = [];
      resultQuery.rows.forEach(element => {
        result.push(new Log(element.id, element.usuario, element.fecha, element.operacion, element.idpelicula, element.accion));
      });
      client.release(true);
      return result;
    } catch (e) {
      console.log("models/log/selectByNicknameAndReactionsReviewLog - " + e);
    }
  },
  selectByNicknameAndReactionsCommentLog: async (nickname, idmovie) => {
    try {
      let client = await connection.connect();
      let sql = "SELECT * FROM log WHERE usuario= $1 and idpelicula=$2 and operacion LIKE 'Update table comment; aumento de los contadores'";
      let values = [nickname, idmovie];
      let resultQuery = await client.query(sql, values);
      let result = [];
      resultQuery.rows.forEach(element => {
        result.push(new Log(element.id, element.usuario, element.fecha, element.operacion, element.idpelicula, element.accion));
      });
      client.release(true);
      return result;
    } catch (e) {
      console.log("models/log/selectByNicknameAndReactionsCommentLog - " + e);
    }
  }
}

module.exports = { Log, functions_log };