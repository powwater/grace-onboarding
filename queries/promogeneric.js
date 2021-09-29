const db = require('../database');

// save generic codes
async function create(promocode) {
  return db("promogeneric").insert(promocode, "*");
}

// fetch generic codes
async function allCodes() {
  return db
    .select(
      "generic.id",
      "generic.code",
      "generic.code_type as codeType",
      "generic.used",
      "generic.redeemed",
      "generic.active",
      "meta.prefix",
      "meta.campaign",
      "meta.campaign_desc as campaignDesc",
      "meta.quantity",
      "meta.start_date as startDate",
      "meta.end_date as endDate"
    )
    .from("promogeneric as generic")
    .leftJoin("promometa as meta", "meta.id", "generic.meta_id");
}

module.exports = {
  create,
  allCodes
};
