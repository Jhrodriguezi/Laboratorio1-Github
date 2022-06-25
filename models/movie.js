const axios = require('axios');
const connection = require('./db');


class Movie {
  #id;
  #puntuacion;
  #nresenas;

  constructor(id, puntuacion, nresenas) {
    this.id = id;
    this.puntuacion = puntuacion;
    this.nresenas = nresenas;
  }

  get getId() {
    return this.id;
  }

  set setId(id) {
    this.id = id;
  }

  get getPuntuacion() {
    return this.puntuacion;
  }

  set setPuntuacion(puntuacion) {
    this.puntuacion = puntuacion;
  }

  get getNresenas() {
    return this.nresenas;
  }

  set setNresenas(nresenas) {
    this.nresenas = nresenas;
  }
}

async function getPelicula(url) {
  //Realizar el request en la api
  try {
    var promise = await requestKey(url)
    //Retornar la lista
    return promise['results']
  } catch (err) {
    console.log(err);
    return undefined;
  }
}

async function requestKey(url) {
  //Realizar el request
  try {
    const resp = await axios.get(url)
    return resp.data
  } catch (err) {
    console.error(err)
  }
}

const functions_movie = {
  insertMovie: async (movie_object) => {
    try {
      let client = await connection.connect();
      let sql = "INSERT INTO pelicula (id, puntuacion, nresenas) values($1, $2, $3)";
      let values = [movie_object.getId, movie_object.getPuntuacion, movie_object.getNresenas];
      let result = await client.query(sql, values);
      client.release(true);
      return result;
    } catch (e) {
      console.log(e);
    }
  },
  selectMovieById: async (id) => {
    try {
      let client = await connection.connect();
      let sql = "SELECT * FROM pelicula WHERE id=$1";
      let values = [id];
      let result = [];
      (await client.query(sql, values)).rows.forEach(movie => {
        result.push(new Movie(movie.id, movie.puntuacion, movie.nresenas));
      })
      client.release(true);
      return result;
    } catch (e) {
      console.log(e);
    }
  },
  updateMovie: async (movie_object) =>{
    try {
      let client = await connection.connect();
      let sql = "UPDATE pelicula SET puntuacion=$1, nresenas=$2 WHERE id=$3";
      let values = [movie_object.getPuntuacion, movie_object.getNresenas, movie_object.getId];
      let result = await client.query(sql, values);
      client.release(true);
      return result;
    } catch (e) {
      console.log(e);
    }
  },
  masPopulares: async () => {
    //Construir la url
    var url = 'https://api.themoviedb.org/3/movie/popular?api_key=8813b9c1e58f9f780d35e52b0ae8f38c&language=es-MX'
    //Retornar lista de peliculas
    return await getPelicula(url)
  },

  buscar: async (name, page = 1) => {
    //Construir la URL
    var urlP1 = 'https://api.themoviedb.org/3/search/movie?api_key=8813b9c1e58f9f780d35e52b0ae8f38c&language=es-MX&query='
    var urlP2 = '&page=' + page;
    name = name.replace(/ /g, '%20');
    var url = urlP1 + name + urlP2
    //Retornar lista de peliculas
    return await getPelicula(url)
  },

  peliculaById: async (id) => {
    let Url = 'https://api.themoviedb.org/3/movie/' + id + '?api_key=77c55698b8c9956169a37ddda45c6409&language=es-MX';
    let result = await requestKey(Url);
    return result;
  },

  selectAllMovies: async () => {
    try {
      let client = await connection.connect();
      let sql = "SELECT * FROM pelicula";
      let result = {};
      let resultQuery = await client.query(sql);
      resultQuery.rows.forEach(movie => {
        result[movie.id]=(new Movie(movie.id, movie.puntuacion, movie.nresenas));
      })
      client.release(true);
      return result;
    } catch (e) {
      console.log("models/movie/selectAllMovies - "+e);
    }
  }
}

module.exports = { Movie, functions_movie };