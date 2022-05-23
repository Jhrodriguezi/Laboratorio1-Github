const axios = require('axios');

async function masPopulares() {
    //Construir la url
    var url= 'https://api.themoviedb.org/3/movie/popular?api_key=8813b9c1e58f9f780d35e52b0ae8f38c&language=es_MX'
    //Retornar lista de peliculas
    return await getPelicula(url)
}

async function buscar(name){
    //Construir la URL
    var urlP1= 'https://api.themoviedb.org/3/search/movie?api_key=8813b9c1e58f9f780d35e52b0ae8f38c&language=es-MX&query='
    var urlP2= '&page=1'
    name = name.replaceAll(' ','%20')      
    var url = urlP1 + name + urlP2
    //Retornar lista de peliculas
    return await getPelicula(url)
}

async function getPelicula(url){
    //Definición de variables
    var listMovies = []
    var length = 0
    //Realizar el request en la api
    try{
        var promise = await requestKey(url)
        //Definir el tamaño de la lista de max 20 peliculas
        promise['results'].length>20 ? length=20 : length = promise['results'].length
        //Llenado de lista
        for (var i=0; i<length; i++){
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
    }catch(err){
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