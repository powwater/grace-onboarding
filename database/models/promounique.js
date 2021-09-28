const promo = require("../../utils/promo");

module.exports.createUniquePromocodeTable = async (knex) => {
  const hasTable = await knex.schema.hasTable("promounique");
  if (!hasTable) {
    await knex.schema.raw('create extension if not exists "uuid-ossp"');
    await knex.schema.createTable("promounique", (table) => {
      table.uuid("id").primary();
      table.uuid("meta_id").references("id").inTable("promometa");
      table.string("code", 30).unique(); //code
      table.text("code_type").defaultTo(promo.types.UNIQUE);
      table.string("beneficiary_phone");
      table.string("beneficiary");
      table.integer("redeemed").defaultTo(0); //number of times it has been redeemed
      // table.uuid("redeemed_by").references("uid").inTable("customers"); //used to track which customer redeemed this code. multiple users can redeem a single promocode.
      table.integer("used").defaultTo(0); //number of times it has been used.
      table.boolean("active").notNullable().defaultTo(true);
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
  }
};

module.exports.dropUniquePromocodeTable = async (knex) => {
  await knex.schema.dropTableIfExists("promounique");
};
