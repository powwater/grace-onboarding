const models = require("../models");

module.exports.up = async function (knex) {
  await models.createUsersTable(knex);
  await models.createCustomersTable(knex);
  await models.createReferrersTable(knex);
  await models.createPromocodeMetaTable(knex);
};

module.exports.down = async function (knex) {
  await models.dropUsersTable(knex);
  await models.dropCustomersTable(knex);
  await models.dropReferrersTable(knex);
  await models.dropPromocodeMetaTable(knex);
};
