let inicios = [1,2,3,4,5,6,7];
let busquedas = [1,2,8,4,5,6,20];
let reseñas = [1,2,10,4,5,6,7];

let inicios_labels = [];
let busquedas_labels = [];
let reseñas_labels = [];

//toca de alguna manera llenar los arrays de datos

const dia = ["00:00","1:00","2:00","3:00","4:00","5:00","6:00","7:00","8:00","9:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"];
const semana = ["Lunes","Martes","Miercoles","Jueves","Viernes","Sabado","Domingo"];
const mes = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const año = ["2020","2021","2022","2023","2024","2025","2026","2027","2028","2029","2030"];

inicios_labels = semana;
busquedas_labels = semana;
reseñas_labels = semana;

const ctx = document.getElementById("cuadro");


let cuadro = new Chart(ctx, {
    type: "line",
    data: {
        labels: inicios_labels,
        datasets: [
            {
                label: "Inicios de sesión",
                backgroundColor: "rgba(255,255,255,0.2)",
                borderColor: "rgba(255,255,255,1)",
                borderWidth: 1,
                hoverBackgroundColor: "rgba(255,99,132,0.4)",
                hoverBorderColor: "rgba(255,99,132,1)",
                data: inicios
            }
        ]
    }
});

const inicios_seciones = document.getElementById("Caracteristica1");
inicios_seciones.addEventListener('change', (event) => {
    cuadro.data.labels = inicios_labels;    
    cuadro.data.datasets[0].data = inicios;
    cuadro.data.datasets[0].label = "Inicios de sesión";
    cuadro.update();
}
);

const busquedas_peliculas = document.getElementById("Caracteristica2");
busquedas_peliculas.addEventListener('change', (event) => {
    cuadro.data.labels = busquedas_labels;    
    cuadro.data.datasets[0].data = busquedas;
    cuadro.data.datasets[0].label = "Búsquedas de películas";
    cuadro.update();
}
);

const reseñas_realizadas = document.getElementById("Caracteristica3");
reseñas_realizadas.addEventListener('change', (event) => {
    cuadro.data.labels = reseñas_labels;    
    cuadro.data.datasets[0].data = reseñas;
    cuadro.data.datasets[0].label = "Reseñas realizadas";
    cuadro.update();
}
);

const dia_seleccionado = document.getElementById("Intervalo1");
dia_seleccionado.addEventListener('change', (event) => {
    inicios_labels = dia;
    busquedas_labels = dia;
    reseñas_labels = dia;
    cuadro.update();
}
);

const semana_seleccionada = document.getElementById("Intervalo2");
semana_seleccionada.addEventListener('change', (event) => {
    inicios_labels = semana;
    busquedas_labels = semana;
    reseñas_labels = semana;
    cuadro.update();
}
);

const mes_seleccionado = document.getElementById("Intervalo3");
mes_seleccionado.addEventListener('change', (event) => {
    inicios_labels = mes;
    busquedas_labels = mes;
    reseñas_labels = mes;
    cuadro.update();
}
);

const año_seleccionado = document.getElementById("Intervalo4");
año_seleccionado.addEventListener('change', (event) => {
    inicios_labels = año;
    busquedas_labels = año;
    reseñas_labels = año;
    cuadro.update();
}
);