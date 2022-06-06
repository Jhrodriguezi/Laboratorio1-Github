const { Movie, functions_movie } = require('../models/movie');
const {Log, functions_log} = require('../models/log');

const movie_functions_movie = {
  cargarPelicula: async (req, res) => {
    let movie, newLog;
    try{
      movie = await functions_movie.peliculaById(req.query.id);
      newLog = new Log(null, req.session.name, null, "Read movie", movie.id, 'El usuario ha consultado la pelicula: '+movie.title);
      await functions_log.insertLog(newLog);
    }catch(e){
      console.log(e);
    }
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