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
  //Definición de variables
  var listMovies = []
  var length = 0
  //Realizar el request en la api
  try {
    var promise = await requestKey(url)
    //Definir el tamaño de la lista de max 20 peliculas
    promise['results'].length > 50 ? length = 50 : length = promise['results'].length
    //Llenado de lista
    for (var i = 0; i < length; i++) {
      //Crear el objeto película
      var movie = {
        adult: promise['results'][i]['adult'],
        backdrop_path: promise['results'][i]['backdrop_path'],
        genre_ids: promise['results'][i]['genre_ids'],
        id: promise['results'][i]['id'],
        original_language: promise['results'][i]['original_language'],
        original_title: promise['results'][i]['original_title'],
        overview: promise['results'][i]['overview'],
        popularity: promise['results'][i]['popularity'],
        poster_path: promise['results'][i]['poster_path'],
        release_date: promise['results'][i]['release_date'],
        title: promise['results'][i]['title'],
        video: promise['results'][i]['video'],
        vote_average: promise['results'][i]['vote_average'],
        vote_count: promise['results'][i]['vote_count']
      }
      //Ingresarlo a la lista
      listMovies.push(movie)
    }
    //Retornar la lista
    return listMovies
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
      let sql = "INSERT INTO pelicula (id, puntuacion, nreseñas) values($1, $2, $3)";
      let values = [movie_object.getId, movie_object.getPuntuacion, movie_object.getNresenas];
      let result = await client.query(sql, values);
      client.release(true);
      return result;
    } catch (e) {
      console.log(e);
    }
  },
  SelectMovieById: async (id) => {
    try {
      let client = await connection.connect();
      let sql = "SELECT * FROM pelicula WHERE id=$1";
      let values = [id];
      let result = await client.query(sql, values);
      client.release(true);
      return result;
    } catch (e) {
      console.log(e);
    }
  },
  updateMovie: async (movie_object) =>{
    try {
      let client = await connection.connect();
      let sql = "UPDATE pelicula SET puntuacion=$1, nreseñas=$2 WHERE id=$3";
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
    let movie = {
      adult: result['adult'],
      backdrop_path: result['backdrop_path'],
      genre_ids: result['genre_ids'],
      id: result['id'],
      original_language: result['original_language'],
      original_title: result['original_title'],
      overview: result['overview'],
      popularity: result['popularity'],
      poster_path: result['poster_path'],
      release_date: result['release_date'],
      title: result['title'],
      video: result['video'],
      vote_average: result['vote_average'],
      vote_count: result['vote_count']
    };
    return movie;
  }
}

module.exports = { Movie, functions_movie };