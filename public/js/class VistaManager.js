//import {buscar} from '../../controllers/movie_controller.js';
const listaPrueba = ["uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez"];

const busquedaPelicula = document.getElementById("BusquedaPelicula");
const resultadoBusqueda = document.getElementById("ResultadoBusqueda");

busquedaPelicula.addEventListener("keyup", function(event) {
  event.preventDefault();

    if (event.target.value.length > 0) {
        //console.log(event.target.value);
        //const lista = buscar(event.target.value);
        //console.log(lista);
        let inner = "";

        inner += `<h1>Resultados de la busqueda (${event.target.value})</h1>`;
        
        //aca deberia ir el codigo para buscar en la base de datos y agregar las pelis a la lista en frontend

        for (let i = 0; i < listaPrueba.length; i++) {
            //quitar include cuando este listo
            if (listaPrueba[i].includes(event.target.value)) {


                inner += `<button class="btn btn-primary" id ="${"seleccionadaBusqueda"+i.toString()}">${listaPrueba[i]}</button>`;
                inner += `<p></p>`;
            };
        

        resultadoBusqueda.innerHTML = inner;

    }
    }

});