const db = require("../database");

async function runMigrations(retries, delay) {
  let errorString;
  for (let i = 1; i !== retries; i++) {
    try {
      return await db.migrate.latest();
    } catch (err) {
      await setTimeoutAsync(delay * i);
      errorString = err.message;
    }
  }

  throw new Error(
    `unable to run migrations after ${retries} attempts.reason ${errorString}`
  );
}

function setTimeoutAsync(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

module.exports = runMigrations;
