module.exports = {
  env: process.env.NODE_ENV || "development",
  runMigration: process.env.MIGRATION_ENABLED || false,
  retryInterval: parseInt(process.env.RETRY_INTERVAL),
  retryAttempts: parseInt(process.env.RETRY_ATTEMPTS),
  server: {
    host: process.env.POW_SRV_HOST,
    port: process.env.POW_SRV_PORT,
    shutdownTimeout: process.env.POW_SRV_SHUTDOWN_TIMEOUT,
    testmode: process.env.POW_SRV_TESTMODE,
  },
  jwt: {
    secret: process.env.POW_JWT_SECRET,
    expiryInMinutes: process.env.POW_JWT_EXPIRY_MINS,
    expiryInDays: process.env.POW_JWT_EXPIRY_DAYS,
  },
  database: {
    client: process.env.POW_DB_CLIENT,
    connection: {
      host: process.env.POW_DB_HOST,
      user: process.env.POW_DB_USER,
      password: process.env.POW_DB_PASSWORD,
      database: process.env.POW_DB_NAME,
    },
    pool: {
      min: process.env.POW_DB_POOL_MIN,
      max: process.env.POW_DB_POOL_MAX,
    },
    debug: process.env.POW_DB_DEBUG,
  },
  logging: {
    level: process.env.POW_LOG_LEVEL,
    rotation: {
      enabled: process.env.POW_LOG_ROTATION_ENABLE,
    },
    transports: [
      process.env.POW_LOG_TRANSPORT_FILE,
      process.env.POW_LOG_TRANSPORT_STDOUT,
    ],
  },
};
