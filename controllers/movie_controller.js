const { Movie, functions_movie } = require('../models/movie');

const movie_functions_movie = {
  cargarPelicula: async (req, res) => {
    let movie = await functions_movie.peliculaById(req.query.id);
    res.send(movie);
  },
  obtenerPeliculasPorNombre: async (req, res) => {
    let movies;
    try{
      movies = await functions_movie.buscar(req.query.name);
    }catch(e){
      console.log(e);
    }
    res.send(movies);
  },
  obtenerPeliculasPopulares: async (req, res) => {
    let movies;
    try{
      movies = await functions_movie.masPopulares();
    }catch(e){
      console.log(e)
    }
    res.send(movies);
  }
}

module.exports = movie_functions_movie;