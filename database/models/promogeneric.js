const promo = require("../../utils/promo");

module.exports.createGenericPromocodeTable = async (knex) => {
  const hasTable = await knex.schema.hasTable("promogeneric");
  if (!hasTable) {
    await knex.schema.raw('create extension if not exists "uuid-ossp"');
    await knex.schema.createTable("promogeneric", (table) => {
      table.uuid("id").primary();
      table.uuid("meta_id").references("id").inTable("promometa");
      table.string("code", 30).unique(); //code
      table.text("code_type").defaultTo(promo.types.GENERIC);
      table.boolean("active").notNullable().defaultTo(true);
      table.integer("redeemed").defaultTo(0); //number of times it has been redeemed
      // table.uuid("redeemed_by").references("uid").inTable("customers"); //used to track which customer redeemed this code. multiple users can redeem a single promocode.
      table.integer("used").defaultTo(0); //number of times it has been used.
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
  }
};

module.exports.dropGenericPromocodeTable = async (knex) => {
  await knex.schema.dropTableIfExists("promogeneric");
};
