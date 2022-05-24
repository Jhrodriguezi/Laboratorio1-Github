const listaPrueba = ["uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez"];

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


const busquedaPelicula = document.getElementById("BusquedaPelicula");
const resultadoBusqueda = document.getElementById("ResultadoBusqueda");

const resolve = (event) => {
    let inner = "";
    if (event.target.value.length > 0) {
        //console.log(event.target.value);
        //const lista = buscar(event.target.value);
        //console.log(lista);

        inner += `<h1>Resultados de la busqueda (${event.target.value})</h1>`;
        
        //aca deberia ir el codigo para buscar en la base de datos y agregar las pelis a la lista en frontend
        buscar(event.target.value)
            .then(result => {
                result.forEach(movie => {
                    

                    inner += `<div class="card" style="width: 18rem; float:right;">
                    <img src="..." class="card-img-top" alt="...">
                    <div class="card-body">
                        <a href="${"/search?id="+movie.id}" id ="${"seleccionadaBusqueda"+movie.title}"><h5 class="card-title">${movie.title}</h5></a>
                        <p class="card-text">${movie.overview}</p>
                    </div>
                    </div>`; 

                    `<div style="width:100%;">
                        <a href="${"/search?id="+movie.id}" id ="${"seleccionadaBusqueda"+movie.title}"><h3>${movie.title}</h3></a>
                        <br>
                        <p style="color-font:white;">${movie.overview}</p>
                        <hr class="border-primary border-3 opacity-75">
                    </div>`
                })
                resultadoBusqueda.innerHTML = inner;
            })
            .catch(err => console.log(err))
        /*for (let i = 0; i < listaPrueba.length; i++) {
            //quitar include cuando este listo
            if (listaPrueba[i].includes(event.target.value)) {


                inner += `<button class="btn btn-primary" id ="${"seleccionadaBusqueda"+i.toString()}">${listaPrueba[i]}</button>`;
                inner += `<p></p>`;
            };
        


        }*/
    }else if(event.target.value.length == 0){

        inner += `<h1>Escribe algo!</h1>`;
    }
    resultadoBusqueda.innerHTML = inner;
}


busquedaPelicula.addEventListener("keyup", resolve);
