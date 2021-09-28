const promo = require("../../utils/promo");

module.exports.createReferralPromocodeTable = async (knex) => {
  const hasTable = await knex.schema.hasTable("promoreferral");
  if (!hasTable) {
    await knex.schema.createTable("promoreferral", (table) => {
      table.uuid("id").primary();
      table.uuid("meta_id").references("id").inTable("promometa");
      table.string("code", 30).unique(); //referral code
      table.text("code_type").defaultTo(promo.types.REFERRAL);
      // table.integer("quantity"); //number of codes to be generated using this
      // table.integer("purchases").defaultTo(0); //number of purchases
      table.boolean("active").notNullable().defaultTo(true);
      table.integer("signups").defaultTo(0); //number of signups achieved by use of this referral code
      table.integer("redeemed").defaultTo(0); //number of times it has been redeemed
      // table.uuid("redeemed_by").references("uid").inTable("customers"); //used to track which customer redeemed this code. multiple users can redeem a single promocode.
      table.integer("used").defaultTo(0); //number of times it has been used.
      table.timestamp("created_at").defaultTo(knex.fn.now()); //for unique code generation
      table.timestamp("updated_at").defaultTo(knex.fn.now()); //for unique code generation
    });
  }
};

module.exports.dropReferralPromocodeTable = async (knex) => {
  await knex.schema.dropTableIfExists("promoreferral");
};
