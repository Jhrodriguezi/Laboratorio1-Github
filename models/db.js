const { Pool } = require('pg')
const connectionData = {
    user: 'zfleobpjlvrjfn',
    host: 'ec2-34-236-94-53.compute-1.amazonaws.com',
    database: 'davt4nb2jt64jj',
    password: 'ddbb6d0e5e8af802b2051d3d99df295d78e4c0b8c023cfdca4fba0b76311fd80',
    port: 5432,
    ssl: {rejectUnauthorized: false}
  }

const pool = new Pool(connectionData);
module.exports = pool;
