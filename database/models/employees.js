module.exports.createEmployeesTable = async (knex) => {
  const hasTable = await knex.schema.hasTable("employees");
  if (!hasTable) {
    //pandora users
    //password is hashed using bcrypt
    await knex.schema.createTable("employees", (table) => {
      table.uuid("id").primary();
      table.text("email").unique();
      table.text("firstname");
      table.text("lastname");
      table.text("password"); //password hash
      table.text("role");
      table.uuid("invited_by").references("id").inTable("employees"); //use who invited or created this user.(another superior user possibly admin)
      table.text("modified_by");
      table.timestamp("modified_at");
      table.boolean("email_verification_code");
      table.timestamp("email_verification_expires");
      table.boolean("email_verified").defaultTo(false);
      table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    });
  }
};

module.exports.dropEmployeesTable = async (knex) => {
  await knex.schema.dropTableIfExists("employees");
};
