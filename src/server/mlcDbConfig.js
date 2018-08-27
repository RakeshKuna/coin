const pg = require('pg');
const connectionString = process.env.DB_URL


async function getConnection()
{
    const client = await new pg.Client(connectionString);
    client.connect();
    return client;
}


module.exports = { getConnection }
