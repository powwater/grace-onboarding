const models = require("../models");

module.exports.up = async function (knex) {
  await models.createUniquePromocodeTable(knex);
  await models.createGenericPromocodeTable(knex);
  await models.createReferralPromocodeTable(knex);
  await models.createRedeemedPromocodeTable(knex);
  await models.createUsedPromocodeTable(knex);
};

module.exports.down = async function (knex) {
  await models.dropUniquePromocodeTable(knex);
  await models.dropGenericPromocodeTable(knex);
  await models.dropReferralPromocodeTable(knex);
  await models.dropRedeemedPromocodeTable(knex);
  await models.dropUsedPromocodeTable(knex);
};
