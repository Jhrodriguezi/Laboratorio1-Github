const connection = require('./db');
const bcrypt = require('bcrypt');

class User {
  #id
  #nickname;
  #email;
  #password;
  #tipousuario;

  constructor(id, nickname, email, password, tipousuario = "user") {
    this.id = id;
    this.nickname = nickname;
    this.email = email;
    this.password = password;
    this.tipousuario = tipousuario;
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

  get getEmail() {
    return this.email;
  }

  /**
   * @param {string} nickname
   */
  set setEmail(email) {
    this.email = email;
  }

  get getPassword() {
    return this.password;
  }

  /**
   * @param {string} nickname
   */
  set setPassword(password) {
    this.password = password;
  }

  get getTipousuario() {
    return this.tipousuario;
  }
}

const functions_user = {
  //Inserta el usuario en la BD
  insertUser: async (user_object) => {
    let res;
    if (user_object.getNickname && user_object.getEmail && user_object.getPassword && user_object.getTipousuario) {
      let client = await connection.connect();
      let sql = "INSERT INTO usuario (nickname, correo, password, tipousuario) VALUES ($1, $2, $3, $4)";
      user_object.setPassword = await bcrypt.hash(user_object.getPassword, 8);
      let values = [user_object.getNickname, user_object.getEmail, user_object.getPassword, user_object.getTipousuario];
      res = await client.query(sql, values);
      client.release(true);
    } else {
      throw new Error('No están todos los datos necesarios para hacer la insercion en la tabla usuario');
    }
    return res;
  },

  //Elimina al usuario en la BD
  deleteUser: async (user_object) => {
    if (user_object.getId) {
      let client = await connection.connect();
      let sql = "DELETE from usuario where id=$1";
      let values = [user_object.getId];
      let result = await client.query(sql, values);
      console.log(result);
      client.release(true);
    } else {
      throw new Error("No se pudo borrar el usuario, puede que no exista");
    }
  },

  //Actualiza la informacion del usuario en la BD
  updateUser: async (user_object) => {
    if (user_object.id && user_object.nickname && user_object.email && user_object.password && user_object.tipousuario) {
      let client = await connection.connect();
      let sql = "UPDATE usuario set nickname=$2, correo=$3, password=$4 where id=$1";
      let values = [user_object.id, user_object.nickname, user_object.email, user_object.password];
      let result = await client.query(sql, values);
      console.log(result);
      client.release(true);
    } else {
      throw new Error("No se definieron los elementos necesarios para la actualizacion del usuario");
    }
  },

  selectAllUsers: async () => {
    let client = await connection.connect();
    let sql = "SELECT * FROM usuario";
    let result = []
    let res = await client.query(sql);
    res.rows.forEach(element => {
      result.push(new User(element.id, element.nickname, element.correo, element.password, element.tipousuario));
    });
    client.release(true);
    return result;
  },

  selectByIdUser: async (id) => {
    let client = await connection.connect();
    let sql = "SELECT * FROM usuario where id=$1";
    let values = [id];
    let result = [];
    let res = await client.query(sql, values);
    res.rows.forEach(element => {
      result.push(new User(element.id, element.nickname, element.correo, element.password, element.tipousuario));
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

module.exports = { User, functions_user };