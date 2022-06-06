const pool = require('./db_log');
async function crearbdLog(){
    let client = await pool.connect();

    // eliminar tabla log
    client.query(`drop table if exists log;`).then(response => {
        console.log("Se ha eliminado la tabla log")
    })
    .catch(err => {
        console.log("ERROR")
        client.end()
    })

    // crear tabla log
    client.query(`create table log(
        id              serial primary key,
        usuario         varchar(30),
        fecha           timestamp,
        operacion       varchar(60),
        idPelicula      bigint,
        accion          text
        );`
    ).then(response => {
    console.log("Se ha creado la tabla log")
    client.end()
    })
    .catch(err => {
    console.log("ERROR")
    client.end()
    })
}
crearbdLog().then(()=>{console.log("exito")}).catch();