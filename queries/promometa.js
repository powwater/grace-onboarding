const db = require("../database");

async function create(meta) {
  return db("promometa").insert(meta, "*");
}

module.exports = {
  create
};