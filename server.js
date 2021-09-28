const debug = require("debug")("server");
const stoppable = require("stoppable");
const config = require("./config");
const logging = require("npmlog");
const moment = require("moment");

class PowwaterServer {
  constructor() {
    this.rootApp = null;
    this.httpServer = null;

    //Tasks that should be run before the server exits.
    this.cleanupTasks = [];
    this.env = config.env;
    this.port = config.server.port;
    this.host = config.server.host;
    this.url = `http://${this.host}:${this.port}`;

    this.messages = {
      listeningOn: `Listening on: ${this.host}:${this.port}`,
      powwaterIsRunning: "Powwater is running...",
      powwaterIsRunningIn: `Powwater server is running in ${this.env}...`,
      powwaterIsShuttingDown: "Powwater server is shutting down",
      powwaterHasShutdown: "Powwater server has shut down",
      yourApiIsNowOffline: "Your powwater api is now offline",
      yourApiIsAvailableOn: `Your powwater api is now available on ${this.url}`,
      ctrlCToShutDown: "Ctrl+C to shut down",
      powwaterWasRunningFor: "Powwater server was running for",
      urlConfiguredAs: `Url configured as ${this.url}`,
      addressInUse: {
        error: "(EADDRINUSE) Cannot start TaskTracker.",
        context: `Port ${this.port} is already in use by another program.`,
        help: "Is another TaskTracker instance already running?",
      },
      otherError: {
        error: `(Code: ${this.errorNumber})`,
        context: "There was an error starting your server.",
        help: "Please use the error code above to search for a solution.",
      },
    };
  }

  /**
   * @name start - Public API Mehods
   * @description Starts the task-tracker server listening on the configured port.
   *              Requires an express app to be passed in.
   *
   * @param {Object} rootApp - Required express app instance.
   * @returns {Promise} Resolves once TaskTracker has started.
   */
  start(rootApp) {
    debug("starting...");

    const self = this;
    self.rootApp = rootApp;

    return new Promise(function (resolve, reject) {
      self.httpServer = rootApp.listen(self.port, self.host);

      self.httpServer.on("error", function (error) {
        let powwaterError;

        if (error.code === "EADDRINUSE") {
          powwaterError = new errors.PowwaterError({
            message: self.messages.otherError.error,
            context: self.messages.otherError.context,
            help: self.messages.addressInUse.help,
          });
        } else {
          self.errorNumber = error.errno;
          powWaterError = new errors.PowwaterError({
            message: self.messages.otherError.error,
            context: self.messages.otherError.context,
            help: self.messages.otherError.help,
          });
        }
        debug("server started (error)");
        return reject(powwaterError);
      });

      self.httpServer.on("listening", function () {
        debug("...Started");
        self._logStartMessages();

        debug("server ready (success)");
        return resolve(self);
      });

      stoppable(self.httpServer, config.server.shutdownTimeout);

      //ensure that powwater server exits gracefully on ctl+c ,sigterm
      //Ensure that task tracker exists correctly on Ctrl+C and SIGTERM
      process
        .removeAllListeners("SIGINT")
        .on("SIGINT", self.shutdown.bind(self))
        .removeAllListeners("SIGTERM")
        .on("SIGTERM", self.shutdown.bind(self));
    });
  }

  /**
   * @name shutdown
   * @param {number} code  - Exit code
   * @description Performs a full shutdown. Stops the server, handles cleanup and exits the process.
   * Called on SIGINT or SIGTERM.
   */
  async shutdown(code = 0) {
    try {
      logging.warn(this.messages.powwaterIsShuttingDown);
      await this.stop();
      setTimeout(() => {
        process.exit(code);
      }, 100);
    } catch (error) {
      logging.error(error);
      setTimeout(() => {
        process.exit(1);
      }, 100);
    }
  }

  /**
   * @name stop
   * @description Stops the server and handles cleanup but does not exit the process
   * Used in tests for quick start/stop actions
   * Called by shutdown to handle server stop and cleanup before exiting
   * @returns {Promise} Resolves once TaskTracker has stopped.
   */
  async stop() {
    try {
      //if we never fully started there is nothing  to stop
      if (this.httpServer && this.httpServer.listening) {
        //we stop the server first so that no new long running requests or processes can be started.
        await this._stopServer();
      }
      //do all of the cleanup tasks
      await this._cleanup();
    } finally {
      //wrap uup
      this.httpServer = null;
      this._logStopMessages();
    }
  }

  /**
   * @name registerCleanupTask
   * @param {function} task - A function that accomplishes a unit of work.
   * @description Add a task that should be called on shutdown.
   */
  registerCleanupTask(task) {
    this.cleanupTasks.push(task);
  }

  /**
   * @description Dees the work of stopping the server using stoppable
   * @returns {Promise} Resolves once TaskTracker stops successfully. Rejects otherwise.
   */
  async _stopServer() {
    return new Promise((resolve, reject) => {
      this.httpServer.stop((error, status) => {
        if (error) {
          return reject(error);
        }
        return resolve(status);
      });
    });
  }

  /**
   * @name cleanup
   * @description Waits until all tasks have finished.
   */
  async _cleanup() {
    //wait for all cleanup tasks to finish
    await Promise.all(this.cleanupTasks.map((task) => task()));
  }

  /**
   * @description Log start messages
   */
  _logStartMessages() {
    logging.info(this.messages.powwaterIsRunningIn);

    if (this.env === "production") {
      logging.info(this.messages.yourApiIsAvailableOn);
    } else {
      logging.info(this.messages.listeningOn);
      logging.info(this.messages.urlConfiguredAs);
    }
    logging.info(this.messages.ctrlCToShutDown);
  }

  /**
   * @description Log stop messages
   */
  _logStopMessages() {
    logging.warn(this.messages.powwaterHasShutdown);

    if (this.env === "production") {
      logging.warn(this.messages.yourApiIsNowOffline);
    }

    let uptime = moment.duration(process.uptime(), "seconds").humanize();

    //always output uptime
    logging.info(`${this.messages.powwaterWasRunningFor} ${uptime}`);
  }
}

module.exports = PowwaterServer;
