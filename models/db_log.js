const { Pool } = require('pg')
const connectionData = {
    user: 'mxswmwafrxtogl',
    host: 'ec2-54-211-255-161.compute-1.amazonaws.com',
    database: 'dbe2rf801fnkt8',
    password: 'f2d06f0370d700bf87f098ff7c98915ac34d7512e7bf137c7d2080f53056d7cd',
    port: 5432,
    ssl: {rejectUnauthorized: false}
  }

const pool = new Pool(connectionData);
module.exports = pool;