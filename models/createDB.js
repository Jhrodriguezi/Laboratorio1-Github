const pool = require('./db');
async function crearbd(){
    let client = await pool.connect();

    // eliminar tabla comentario
    client.query(`drop table if exists comentario;`).then(response => {
        console.log("Se ha eliminado la tabla comentario")
    })
    .catch(err => {
        console.log("ERROR")
        client.end()
    })
    // eliminar tabla reseña
    client.query(`drop table if exists resena;`).then(response => {
        console.log("Se ha eliminado la tabla resena")
    })
    .catch(err => {
        console.log("ERROR")
        client.end()
    })
    // eliminar tabla pelicula
    client.query(`drop table if exists pelicula;`).then(response => {
        console.log("Se ha eliminado la tabla pelicula")
    })
    .catch(err => {
        console.log("ERROR")
        client.end()
    })
    // eliminar tabla usuario
    client.query(`drop table if exists usuario;`).then(response => {
        console.log("Se ha eliminado la tabla usuario")
    })
    .catch(err => {
        console.log("ERROR")
        client.end()
    })
    
    
    
    // crear tabla usuario
    client.query(`create table usuario(
                        id              serial primary key,
                        nickname        varchar(30),
                        correo          varchar(50),
                        password        varchar(60),
                        tipousuario     varchar(30)
                        );`
    ).then(response => {
        console.log("Se ha creado la tabla usuario")
    })
    .catch(err => {
        console.log("ERROR")
        client.end()
    })

    client.query(`alter table usuario
    add constraint unique_nickname
    unique (nickname)`).then(response => {
        console.log("Se ha modificado la tabla usuario")
    })
    .catch(err => {
        console.log("ERROR")
        client.end()
    })

    client.query(`alter table usuario
    add constraint unique_email
    unique (correo)`).then(response => {
        console.log("Se ha modificado la tabla usuario")
    })
    .catch(err => {
        console.log("ERROR")
        client.end()
    })
    
    // crear tabla pelicula
    client.query(`create table pelicula(
        id              bigint primary key,
        puntuacion      decimal,
        NReseñas        bigint
        );`
    ).then(response => {
    console.log("Se ha creado la tabla pelicula")
    })
    .catch(err => {
    console.log("ERROR")
    client.end()
    })
    
    // crear tabla reseña
    client.query(`create table resena(
                        id              serial primary key,
                        encabezado      varchar(50),
                        contenido       text,
                        likes           integer,
                        dislikes        integer,
                        denuncias       integer,
                        fechaPub        timestamp,
                        puntuacion      decimal,
                        idUsuario       bigint REFERENCES usuario(id) ON DELETE CASCADE ON UPDATE CASCADE,    
                        idPelicula      bigint REFERENCES pelicula(id) ON DELETE CASCADE ON UPDATE CASCADE 
                        );`
    ).then(response => {
        console.log("Se ha creado la tabla resena")
    })
    .catch(err => {
        console.log("ERROR")
        client.end()
    })
    
    // crear tabla comentario
    client.query(`create table comentario(
        id              serial primary key,
        contenido       text,
        likes           integer,
        dislikes        integer,
        denuncias       integer,
        fechaPub        timestamp,
        idUsuario       bigint REFERENCES usuario(id) ON DELETE CASCADE ON UPDATE CASCADE,    
        idReseña        bigint REFERENCES reseña(id) ON DELETE CASCADE ON UPDATE CASCADE 
        );`
    ).then(response => {
    console.log("Se ha creado la tabla comentario")
    client.end()
    })
    .catch(err => {
    console.log("ERROR")
    client.end()
    })
}

crearbd().then(()=>{console.log("exito")}).catch();