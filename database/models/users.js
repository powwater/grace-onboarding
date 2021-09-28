module.exports.createUsersTable = async (knex) => {
  const hasTable = await knex.schema.hasTable("users");
  if (!hasTable) {
    await knex.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
    await knex.schema.createTable("users", (table) => {
      // table.enu("role_t", ["admin", "vendor", "customer"]);
      table.uuid("uid").primary();
      table.text("email").unique();
      table.text("hashed_password"); //password hash
      table.text("email_verification_code");
      table.boolean("email_verified").defaultTo(false);
      table.timestamp("email_verification_expires");
      table.text("phone", 15).unique();
      table.text("hashed_pin"); //pin hash
      table.text("app_name");
      table.text("role");
      table.text("created_by");
      table.text("modified_by");
      table.boolean("is_admin").notNullable().defaultTo(false);
      table.boolean("is_inivite_accepted").notNullable().defaultTo(false);
      table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
      table.timestamp("modified_at");
    });
  }
};

module.exports.dropUsersTable = async (knex) => {
  await knex.schema.dropTableIfExists("users");
};
