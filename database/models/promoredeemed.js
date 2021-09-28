module.exports.createRedeemedPromocodeTable = async (knex) => {
  const hasTable = await knex.schema.hasTable("promoredeemed");
  if (!hasTable) {
    await knex.schema.createTable("promoredeemed", (table) => {
      table.uuid("id").primary();
      table.uuid("user_id").references("uid").inTable("customers");
      table.uuid("generic_code_id").references("id").inTable("promogeneric");
      table.uuid("referral_code_id").references("id").inTable("promoreferral");
      table.uuid("unique_code_id").references("id").inTable("promounique");
      table.text("code_type").notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now()); //for unique code generation
      table.timestamp("updated_at").defaultTo(knex.fn.now()); //for unique code generation
    });
  }
};

module.exports.dropRedeemedPromocodeTable = async (knex) => {
  await knex.schema.dropTableIfExists("promoredeemed");
};
