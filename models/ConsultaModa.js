const axios = require('axios');
const connection = require('./db');

async function getModa(id) {
    try {
        let client = await connection.connect();
        let sql = "SELECT puntuacion, count(puntuacion) FROM resena WHERE idpelicula=$1 group by puntuacion order by count(puntuacion) desc";
        let values = [id];
        let result = [], resp;
        resp = await client.query(sql, values);
        resp.rows.forEach(element => {
          result.push(element.puntuacion);
        });
        client.release(true);
        return result[0];
      } catch (e) {
        console.log(e);
      }
  }

  async function getMediana(id) {
    try {
        let client = await connection.connect();
        let sql = "select percentile_disc(0.5) within group (order by puntuacion) from resena WHERE idpelicula=$1";
        let values = [id];
        let result = [], resp;
        resp = await client.query(sql, values);
        resp.rows.forEach(element => {
          result.push(element.percentile_disc);
        });
        client.release(true);
        return result[0];
      } catch (e) {
        console.log(e);
      }
  }

  getModa(829557).then(val => console.log("moda "+val))
  getMediana(829557).then(val => console.log("mediana " +val))