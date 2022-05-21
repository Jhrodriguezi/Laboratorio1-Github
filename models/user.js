const connection = require('./db');
const bcrypt = require('bcrypt');

class User{
    #id
    #nickname;
    #email;
    #password;
    #tipousuario;

    constructor(id, nickname, email, password, tipousuario = "user"){
        this.id = id;
        this.nickname = nickname;
        this.email = email;
        this.password = password;
        this.tipousuario = tipousuario;
    }

    get getId(){
        return this.id;
    }

    /**
     * @param {any} id
     */
    set setId(id){
        this.id = id;
    }

    get getNickname() {
        return this.nickname;
    }

    /**
     * @param {string} nickname
     */
    set setNickname(nickname){
        this.nickname = nickname;
    }

    get getEmail(){
        return this.email;
    }

    /**
     * @param {string} nickname
     */
    set setEmail(email){
        this.email = email;
    }

    get getPassword(){
        return this.password;
    }

    /**
     * @param {string} nickname
     */
    set setPassword(email){
        this.email = email;
    }

    get getTipousuario(){
        return this.tipousuario;
    }

    //Inserta el usuario en la BD
    async insertUser(){
        let res;
        if(this.nickname && this.email && this.password && this.tipousuario){
            let client = await connection.connect();
            let sql = "INSERT INTO usuario (nickname, correo, password, tipousuario) VALUES ($1, $2, $3, $4)";
            this.password = await bcrypt.hash(this.password, 8);
            let values = [this.nickname, this.email, this.password, this.tipousuario];
            res = await client.query(sql, values);
            client.release(true);
        }else{
            throw new Error('No están todos los datos necesarios para hacer la insercion en la tabla usuario');
        }
        return res;
    }

    //Elimina al usuario en la BD
    async deleteUser(){
        if(this.id){
            let client = await connection.connect();
            let sql = "DELETE from usuario where id=$1";
            let values = [this.id];
            let result = await client.query(sql, values);
            console.log(result);
            client.release(true);
        }else{
            throw new Error("No se definieron los elementos necesarios para la insercion del usuario");
        }
    }

    //Actualiza la informacion del usuario en la BD
    async updateUser(){
        if(this.id && this.nickname && this.email && this.password && this.tipousuario){
            let client = await connection.connect();
            let sql = "UPDATE usuario set nickname=$2, correo=$3, password=$4 where id=$1";
            let values = [this.id, this.nickname, this.email, this.password];
            let result = await client.query(sql, values);
            console.log(result);
            client.release(true);
        }else{
            throw new Error("No se definieron los elementos necesarios para la insercion del usuario");
        }
    }

    async selectAllUsers(){
        let client = await connection.connect();
        let sql = "SELECT * FROM usuario";
        let result = []
        let res = await client.query(sql);
        res.rows.forEach(element => {
            result.push(new User(element.id, element.nickname, element.correo, element.password, element.tipousuario));
        });
        client.release(true);
        return result;
    }

    async selectByIdUser(){
        let client = await connection.connect();
        let sql = "SELECT * FROM usuario where id=$1";
        let values = [this.id];
        let result = [];
        let res = await client.query(sql, values);
        res.rows.forEach(element => {
            result.push(new user(element.id, element.nickname, element.correo, element.password, element.tipousuario));
        });
        client.release(true);
        return result;
    }
}
module.exports = User;