const models = require("../models");

module.exports.up = async function (knex) {
  await models.createEmployeesTable(knex);
};

module.exports.down = async function (knex) {
  await models.dropEmployeesTable(knex);
};
