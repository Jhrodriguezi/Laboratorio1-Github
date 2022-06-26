const { Pool } = require('pg')
const connectionData = {
    user: 'scyeqfvskdcpwu',
    host: 'ec2-44-205-41-76.compute-1.amazonaws.com',
    database: 'd4b1dtsrsnii2v',
    password: 'ec85b450890ba1d984c9f085983b361bf3c0dd6e2f22e6b82d5f5888a11b5053',
    port: 5432,
    ssl: {rejectUnauthorized: false}
  }

const pool = new Pool(connectionData);
module.exports = pool;
