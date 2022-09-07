let inicios_labels = [];
let busquedas_labels = [];
let reseñas_labels = [];

let data_sesiones, data_busquedas, data_reseñas;

let inicios = [];
let busquedas = [];
let reseñas = [];

//toca de alguna manera llenar los arrays de datos

const dia = ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"];
const semana = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
const mes = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const año = ["2020", "2021", "2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"];

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
        data: inicios,
        frequency: 'semanal'
      }
    ]
  }
});

const inicios_sesiones = document.getElementById("Caracteristica1");
inicios_sesiones.addEventListener('change', (event) => {
  cuadro.data.labels = inicios_labels;
  switch (cuadro.data.datasets[0].frequency) {
    case 'hora':
      data_in_hours(data_sesiones, 'i');
      break;
    case 'semanal':
      data_in_weeks(data_sesiones, 'i');
      break;
    case 'mensual':
      data_in_months(data_sesiones, 'i');
      break;
    case 'anual':
      data_in_years(data_sesiones, 'i');
      break;
    default:
      console.log('No se encontró otra opcion');
  }
  cuadro.data.datasets[0].data = inicios;
  cuadro.data.datasets[0].label = "Inicios de sesión";
  cuadro.update();
}
);

const busquedas_peliculas = document.getElementById("Caracteristica2");
busquedas_peliculas.addEventListener('change', (event) => {
  cuadro.data.labels = busquedas_labels;
  console.log(cuadro.data.datasets[0].frequency)
  switch (cuadro.data.datasets[0].frequency) {
    case 'hora':
      data_in_hours(data_busquedas, 'b');
      break;
    case 'semanal':
      data_in_weeks(data_busquedas, 'b');
      break;
    case 'mensual':
      data_in_months(data_busquedas, 'b');
      break;
    case 'anual':
      data_in_years(data_busquedas, 'b');
      break;
    default:
      console.log('No se encontró otra opcion');
  }
  cuadro.data.datasets[0].data = busquedas;
  cuadro.data.datasets[0].label = "Búsquedas de películas";
  cuadro.update();
}
);

const reseñas_realizadas = document.getElementById("Caracteristica3");
reseñas_realizadas.addEventListener('change', (event) => {
  cuadro.data.labels = reseñas_labels;
  switch (cuadro.data.datasets[0].frequency) {
    case 'hora':
      data_in_hours(data_reseñas, 'r');
      break;
    case 'semanal':
      data_in_weeks(data_reseñas, 'r');
      break;
    case 'mensual':
      data_in_months(data_reseñas, 'r');
      break;
    case 'anual':
      data_in_years(data_reseñas, 'r');
      break;
    default:
      console.log('No se encontró otra opcion');
  }
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
  cuadro.data.datasets[0].frequency = 'hora';
  switch (cuadro.data.datasets[0].label) {
    case 'Inicios de sesión':
      data_in_hours(data_sesiones, 'i');
      break;
    case 'Búsquedas de películas':
      data_in_hours(data_busquedas, 'b');
      break;
    case 'Reseñas realizadas':
      data_in_hours(data_reseñas, 'r');
      break;
    default:
      console.log('No se encontró otra opcion');
  }
  evaluar();
  cuadro.update();
}
);

const semana_seleccionada = document.getElementById("Intervalo2");
semana_seleccionada.addEventListener('change', (event) => {
  inicios_labels = semana;
  busquedas_labels = semana;
  reseñas_labels = semana;
  cuadro.data.datasets[0].frequency = 'semanal';
  switch (cuadro.data.datasets[0].label) {
    case 'Inicios de sesión':
      data_in_weeks(data_sesiones, 'i');
      break;
    case 'Búsquedas de películas':
      data_in_weeks(data_busquedas, 'b');
      break;
    case 'Reseñas realizadas':
      data_in_weeks(data_reseñas, 'r');
      break;
    default:
      console.log('No se encontró otra opcion');
  }
  evaluar();
  cuadro.update();
}
);

const mes_seleccionado = document.getElementById("Intervalo3");
mes_seleccionado.addEventListener('change', (event) => {
  inicios_labels = mes;
  busquedas_labels = mes;
  reseñas_labels = mes;
  cuadro.data.datasets[0].frequency = 'mensual';
  switch (cuadro.data.datasets[0].label) {
    case 'Inicios de sesión':
      data_in_months(data_sesiones, 'i');
      break;
    case 'Búsquedas de películas':
      data_in_months(data_busquedas, 'b');
      break;
    case 'Reseñas realizadas':
      data_in_months(data_reseñas, 'r');
      break;
    default:
      console.log('No se encontró otra opcion');
  }
  evaluar();
  cuadro.update();
}
);

const año_seleccionado = document.getElementById("Intervalo4");
año_seleccionado.addEventListener('change', (event) => {
  inicios_labels = año;
  busquedas_labels = año;
  reseñas_labels = año;
  cuadro.data.datasets[0].frequency = 'anual';
  switch (cuadro.data.datasets[0].label) {
    case 'Inicios de sesión':
      data_in_years(data_sesiones, 'i');
      break;
    case 'Búsquedas de películas':
      data_in_years(data_busquedas, 'b');
      break;
    case 'Reseñas realizadas':
      data_in_years(data_reseñas, 'r');
      break;
    default:
      console.log('No se encontró otra opcion');
  }
  evaluar();
  cuadro.update();
}
);
inputs_disabled(true);
axios.get('/data/tendencias')
  .then(res => {
    data_sesiones = res.data.data_sesiones;
    data_busquedas = res.data.data_busquedas;
    data_reseñas = res.data.data_reseñas;
    data_in_weeks(data_sesiones, 'i');
    cuadro.update();
    inputs_disabled(false);
  })
  .catch(err => console.log(err));

function inputs_disabled(bool){
  let inputs = document.getElementsByClassName('form-check-input');
  for(let i = 0; i<inputs.length; i++){
    inputs[i].disabled = bool;
  }
  
}


function evaluar() {
  switch (cuadro.data.datasets[0].label) {
    case 'Inicios de sesión':
      cuadro.data.labels = inicios_labels;
      break;
    case 'Búsquedas de películas':
      cuadro.data.labels = busquedas_labels;
      break;
    case 'Reseñas realizadas':
      cuadro.data.labels = reseñas_labels;
      break;
    default:
      console.log('No se encontró otra opcion');
  }
}

function data_in_hours(data, letter){
  let object={};
  for(let i = 0; i<dia.length; i++){
    object[dia[i]] = 0;
  }
  let h;
  for(let i = 0; i<data.length; i++){
    data[i].fecha = new Date(data[i].fecha);
    h = data[i].fecha.getHours();
    if(h<='9'){
      h = '0'+h+':00';
    }else{
      h = h+':00';
    }
    object[h]+=1;
  }
  switch(letter){
    case 'i':
      inicios.length = 0;
      for(let e in object){
        inicios.push(object[e]);
      }
      break;
    case 'r':
      reseñas.length = 0;
      for(let e in object){
        reseñas.push(object[e]);
      }
      break;
    case 'b':
      busquedas.length = 0;
      for(let e in object){
        busquedas.push(object[e]);
      }
      break;
    default:
      console.log('No se encontró otra opcion');
  }
}

function data_in_weeks(data, letter){
  let object={};
  for(let i = 0; i<semana.length; i++){
    object[i] = 0;
  }
  for(let i = 0; i<data.length; i++){
    data[i].fecha = new Date(data[i].fecha);
    object[data[i].fecha.getUTCDay()]+=1;
  }
  switch(letter){
    case 'i':
      inicios.length = 0;
      for(let e in object){
        inicios.push(object[e]);
      }
      break;
    case 'r':
      reseñas.length = 0;
      for(let e in object){
        reseñas.push(object[e]);
      }
      break;
    case 'b':
      busquedas.length = 0;
      for(let e in object){
        busquedas.push(object[e]);
      }
      break;
    default:
      console.log('No se encontró otra opcion');
  }
}

function data_in_months(data, letter){
  let object={};
  for(let i = 0; i<mes.length; i++){
    object[i] = 0;
  }
  for(let i = 0; i<data.length; i++){
    data[i].fecha = new Date(data[i].fecha);
    object[data[i].fecha.getMonth()]+=1;
  }
  switch(letter){
    case 'i':
      inicios.length = 0;
      for(let e in object){
        inicios.push(object[e]);
      }
      break;
    case 'r':
      reseñas.length = 0;
      for(let e in object){
        reseñas.push(object[e]);
      }
      break;
    case 'b':
      busquedas.length = 0;
      for(let e in object){
        busquedas.push(object[e]);
      }
      break;
    default:
      console.log('No se encontró otra opcion');
  }
}

function data_in_years(data, letter){
  let object={};
  for(let i = 0; i<año.length; i++){
    object[año[i]] = 0;
  }
  for(let i = 0; i<data.length; i++){
    data[i].fecha = new Date(data[i].fecha);
    object[data[i].fecha.getFullYear()]+=1;
  }
  console.log(object);
  switch(letter){
    case 'i':
      inicios.length = 0;
      for(let e in object){
        inicios.push(object[e]);
      }
      break;
    case 'r':
      reseñas.length = 0;
      for(let e in object){
        reseñas.push(object[e]);
      }
      break;
    case 'b':
      busquedas.length = 0;
      for(let e in object){
        busquedas.push(object[e]);
      }
      break;
    default:
      console.log('No se encontró otra opcion');
  }
}