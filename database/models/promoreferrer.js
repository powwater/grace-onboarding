module.exports.createReferrersTable = async (knex) => {
  const hasTable = await knex.schema.hasTable("referrers");
  if (!hasTable) {
    //customers table contains the customer's metadata
    await knex.schema.createTable("referrers", (table) => {
      table.uuid("id").primary();
      table.uuid("referrer_id").references("uid").inTable("customers"); //the customer(referrer) who referred another customer(referree).this maps to the customer uid field.
      table.uuid("referree_id").references("uid").inTable("customers"); //customer who was referred.
      table.text("modified_by");
      table.timestamp("modified_at");
      table.text("created_by");
      table.timestamp("created_at");
    });
  }
};

module.exports.dropReferrersTable = async (knex) => {
  await knex.schema.dropTableIfExists("referrers");
};
