const busquedaPelicula = document.getElementById("BusquedaPelicula");
const resultadoBusqueda = document.getElementById("ResultadoBusqueda");
const peliculasPoupulares = document.getElementById('div_movies_popular');
var id_time = 0;

function getInner(movie) {
  let inner = "";
  let image = "/resources/img/imagen_no_disponible.png";
  if (!movie.overview) {
    movie.overview = "Sin resumen.";
  } else {
    movie.overview = (movie.overview).slice(0, 40).trim() + "...";
  }
  if (movie.poster_path) {
    image = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
  }

  inner += `<div class="col col-md-4 col-sm-6" style="text-align: left;">
                    <div class="portfolio-item">
                        <div class="thumb">
                            <a href="${"/search?id=" + movie.id}" id ="${movie.id}"><div class="hover-effect">
                                <div class="hover-content" style="max-width: 400px; min-width:350px; margin-bottom:5%;">
                                    <h1 style="line-height:1">${movie.title}</h1><br>
                                    <p>${movie.overview}</p>
                                </div>
                            </div>
                            <div class="image">
                                <img src="${image}" style="height: 573px; max-width: 400px; min-width:350px;">
                            </div></a>
                        </div>
                    </div>
                </div>`;
  return inner;
}

const load_movies = async () => {
  let inner = "";
  axios.get('/search/movies/popular')
    .then(resp => {
      for (let i = 0; i < 3; i++) {
        inner += getInner(resp.data[i]);
      }
      peliculasPoupulares.innerHTML = inner;
    })
    .catch(e => console.log(e));
}

const resolve = (event) => {
  let inner = "";
  if (event.target.value.length > 0) {
    inner += `<h1 style="color:white;">Resultados de la busqueda (${event.target.value})</h1>`;
    inner += `<div class="row align-items-start">`;
    console.log(`/search/movies?name=${event.target.value}`);
    axios.get(`/search/movies?name=${event.target.value}`)
      .then(resp => {
        resp.data.forEach(movie => {
          inner += getInner(movie);
        })
        inner += `</div>`;
        resultadoBusqueda.innerHTML = inner;
      })
      .catch(err => console.log(err))
  } else if (event.target.value.length == 0) {
    inner += `<h1 style="color:white;">Escribe algo!</h1>`;
  }
  resultadoBusqueda.innerHTML = inner;
}

window.onload = load_movies;
busquedaPelicula.addEventListener("keyup", (e) => {
  clearTimeout(id_time);
  id_time = setTimeout(resolve, 300, e);
});
