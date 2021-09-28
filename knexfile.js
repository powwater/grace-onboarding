// Update with your config settings.
//Refer this for additional knex configuration values
//https://github.com/GoogleCloudPlatform/nodejs-docs-samples/blob/19d201c1f0/cloud-sql/postgres/knex/server.js
const config = require("./config");

module.exports = {
  development: {
    client: "postgresql",
    connection: { ...config.database.connection },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "dev_migrations",
      directory: __dirname + "/database/migrations",
    },
  },

  staging: {
    client: "postgresql",
    connection: { ...config.database.connection },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "staging_migrations",
    },
    seeds: {
      directory: __dirname + "/database/seeds",
    },
  },

  production: {
    client: "postgresql",
    connection: { ...config.database.connection },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "prod_migrations",
      directory: __dirname + "/database/migrations",
    },
    seeds: {
      directory: __dirname + "/database/seeds",
    },
  },
};
