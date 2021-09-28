module.exports.createPromocodeTable = async (knex) => {
  const hasTable = await knex.schema.hasTable("promo");
  if (!hasTable) {
    await knex.schema.raw('create extension if not exists "uuid-ossp"');
    await knex.schema.createTable("promo", (table) => {
      table.uuid("id").primary();
      table.string("creator", 255).defaultTo("system"); //Should allow null if Generic and Unique,
      table.string("prefix_id").references("id").inTable("promoprefix");
      table.string("code", 30).unique(); //code
      table.string("code_type", 10); //referral, generic, unique
      table.string("slogan", 255).defaultTo("water is life"); //null for referral
      table.string("campaign");
      table.string("campaign_desc");
      table.string("beneficiary_phone");
      table.string("beneficiary");
      // table.integer("purchases");
      table.boolean("redeemed").notNullable().defaultTo(false); //whether the promo code has been redeemed (fetched from the backend)
      table.boolean("active").notNullable().defaultTo(true);
      table.timestamp("redeemed_at");
      table.datetime("used_at"); //when the promocode was used
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
  }
};

module.exports.dropPromocodeTable = async (knex) => {
  await knex.schema.dropTableIfExists("promo");
};
