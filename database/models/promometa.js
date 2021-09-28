module.exports.createPromocodeMetaTable = async (knex) => {
  const hasTable = await knex.schema.hasTable("promometa");
  if (!hasTable) {
    await knex.schema.createTable("promometa", (table) => {
      table.uuid("id").primary();
      table.string("prefix", 30).unique(); //code
      table.uuid("customer_id").references("uid").inTable("customers"); //this prefix was generated from this customer's signup
      table.string("creator", 255).defaultTo("system");
      table.string("campaign"); //for generic promocodes
      table.string("campaign_desc"); //for generic promocodes
      table.integer("quantity"); //number of codes generated using this
      // table.integer("purchases").defaultTo(0); //number of purchases carried out using this promocode prefix
      table.integer("discount").defaultTo(0); //default 0 means no discount
      table.integer("delivery").defaultTo(0); //by default 0 means free
      table.datetime("start_date").defaultTo(knex.fn.now());
      table.datetime("end_date").defaultTo(knex.fn.now());
      table.timestamp("created_at").defaultTo(knex.fn.now()); //for unique code generation
      table.timestamp("updated_at").defaultTo(knex.fn.now()); //for unique code generation
    });
  }
};

module.exports.dropPromocodeMetaTable = async (knex) => {
  await knex.schema.dropTableIfExists("promometa");
};
