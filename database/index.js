// const config = require("../config");
const knex = require("knex");
const knexfile = require("../knexfile");

const afterCreate = function (connection, callback) {
  connection.query("SET timezone='Africa/Nairobi';", function (err) {
    if (err) {
      //first query failed, return error and don't try to make next query
      callback(err, connection);
    } else {
      //do the second query
      connection.query("SET client_encoding = utf8;", function (err) {
        // if err is not falsy, connection is discarded from pool
        // if connection aquire was triggered by a query the error is passed to query promise
        callback(err, connection);
      });
    }
  });
};

//environment should be set in the config env file; supported modes: [production, development, staging]
function configure(dbConfig) {
  let config = {
    ...dbConfig,
    acquireConnectionTimeout: 60000, //60 seconds
    createTimeoutMillis: 3000, //30 seconds
    createRetryIntervalMillis: 200, //0.2 seconds
    idleTimeoutMillis: 600000, //60 seconds
    pool: { ...dbConfig.pool, acquireTimeoutMillis: 60000, afterCreate },
  };

  return config;
}

const knexInstance = knex(configure(knexfile[process.env.NODE_ENV]));

module.exports = knexInstance;
