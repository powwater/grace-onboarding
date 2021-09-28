const debug = require("debug")("boot");
const runMigrations = require("./utils/migrations");
const db = require("./database");

class InitLogger {
  constructor(logging, startTime) {
    this.logging = logging;
    this.startTime = startTime;
  }

  log(message) {
    let { logging, startTime } = this;
    logging.info(`Pow Water ${message} in ${(Date.now() - startTime) / 1000}s`);
  }
}

async function initCore(powwaterServer) {
  debug("Begin: initCore");
  debug("Begin: Job Service");

  //register services here (long running tasks coz they need to be shutdown cleanly when the server shutsdown)
  // const SmsService = require("../services/sms");
  // const smsJob = new SmsService();
  // powwaterServer.registerCleanupTask(async () => {
  //   await smsJob.shutdown();
  // });
  debug("End: Job service");
  debug("End: initCore");
}

/**
 *
 * @param {number} noOfRetries number of times to retry connection before giving up
 * @param {number} delayInterval delay in milliseconds between each retry attempt
 * @returns
 */
// async function connectToDatabase(noOfRetries, delayInterval) {
//   const setTimeoutAsync = function (ms) {
//     return new Promise((resolve) => {
//       setTimeout(resolve, ms);
//     });
//   };

//   for (let i = 1; i < noOfRetries; i++) {
//     try {
//       return await db.select(db.raw("1"));
//     } catch (err) {
//       setTimeoutAsync(delayInterval * i);
//     }
//   }

//   throw new Error(
//     `unable to connect to database after ${noOfRetries} attempts.`
//   );
// }

async function initPowwater(app) {
  const startTime = Date.now();
  debug("Begin init");

  let config;
  let logging;
  let powwaterServer;
  let initLogger;

  try {
    //step 0 load config and logging package
    debug("Begin: load config");
    config = require("./config");
    debug("End: load config");
    debug("Begin: load logging");
    // logging = require("./utils/logger");
    logging = require("npmlog");
    initLogger = new InitLogger(logging, startTime);
    debug("End: load logging");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }

  try {
    debug("Begin: Test database connection");
    // await connectToDatabase(config.retryAttempts, config.retryInterval);
    await db.select(db.raw("1"));
    logging.info("database connected successfully");
    debug("End: Test database connection");

    if (config.runMigration) {
      debug("Begin: Run database migrations");
      const res = await runMigrations(
        config.retryAttempts,
        config.retryInterval
      );
      logging.info(`Batch ${res[0]} run: ${res[1].length} migrations`);
      if (res[1].length > 0) {
        logging.info(res[1].join("\n"));
      } else {
        logging.info("Already up to date");
      }
      debug("End: Run database migrations");
    }
    debug("Begin: load server");
    const PowwaterServer = require("./server");
    const powwaterServer = new PowwaterServer();
    await powwaterServer.start(app);
    initLogger.log("server started");
    debug("End: Load server");

    // debug("Begin: Load core services");
    // await initCore(powwaterServer);
    // debug("End: Load core services");

    //we return the server purely for testing purposes.
    debug("End init: returning powwater server");
    return powwaterServer;
  } catch (error) {
    //Neeed to check instance of error and output the corrct error,also we don't want to output critical error message to the terminal. Some error messages need to be redacted or generalized to avoid breaches.
    logging.error(error);

    //If tasktracker was started and something else went wrong, we shut it down.
    if (powwaterServer) {
      powwaterServer.shutdown(2);
    } else {
      //Task tracker server failed to start, set a timeout o give logging a chance to finish.
      setTimeout(() => {
        process.exit(2);
      }, 100);
    }
  }
}

module.exports = initPowwater;
