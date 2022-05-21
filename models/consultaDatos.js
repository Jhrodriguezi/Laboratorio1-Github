const connection = require('./db');
const user = require('./user');

const consultas = {
    selectAllUsers: async () => {
        let client = await connection.connect();
        let sql = "SELECT * FROM usuario";
        let result = []
        let res = await client.query(sql);
        res.rows.forEach(element => {
            result.push(new user(element.id, element.nickname, element.correo, element.password, element.tipousuario));
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
            result.push(new user(element.id, element.nickname, element.correo, element.password, element.tipousuario));
        });
        client.release(true);
        return result;
    }
}
module.exports = consultas;