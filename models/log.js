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

  selectByNickOrEmailUser: async (email_or_nickname) => {
    let client = await connection.connect();
    let sql = "SELECT * FROM usuario where nickname=$1 or correo=$2";
    let values = [email_or_nickname, email_or_nickname];
    let result = [];
    let res = await client.query(sql, values);
    res.rows.forEach(element => {
      result.push(new User(element.id, element.nickname, element.correo, element.password, element.tipousuario));
    });
    client.release(true);
    return result;
  }
}

module.exports = { Log, functions_log };