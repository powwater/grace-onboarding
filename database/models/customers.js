module.exports.createCustomersTable = async (knex) => {
  const hasTable = await knex.schema.hasTable("customers");
  if (!hasTable) {
    //customers table contains the customer's metadata
    //customer app users
    await knex.schema.createTable("customers", (table) => {
      table.uuid("uid").primary(); //maps to the users uid primary key should change though
      // table.uuid("referer_id").references("id").inTable("referrers");
      //the customer(referrer) who referred this customer(referree)
      table.text("customer_first_name");
      table.text("customer_last_name");
      table.text("customer_phone_number").unique();
      table.text("customer_phone_region");
      table.text("gender");
      table.date("dob");
      table.text("modified_by");
      table.timestamp("modified_at");
      table.text("created_by");
      table.timestamp("created_at").defaultTo(knex.fn.now());
    });
  }
};

module.exports.dropCustomersTable = async (knex) => {
  await knex.schema.dropTableIfExists("customers");
};
