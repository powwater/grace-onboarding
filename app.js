const express = require("express");
const ApiError = require("./errors");

const cors = require("cors");
const httpStatus = require("http-status");
const pino = require("express-pino-logger")();

const app = express();

const errorHandler = (err, req, res, next) => {
  const logging = require("npmlog");

  err.statusCode = err.statusCode || 500;

  logging.error(err);
  console.error(err);

  //postgres unique contraint violation
  if (err.code === "23505") {
    return res.status(httpStatus.CONFLICT).json({
      statusCode: httpStatus.CONFLICT,
      message: "resource already exists",
    });
  } else if (err.code === "23502") {
    //postgres null constraint violation
    return res.status(httpStatus.BAD_REQUEST).json({
      statusCode: httpStatus.BAD_REQUEST,
      message: httpStatus[`${httpStatus.BAD_REQUEST}_MESSAGE`],
    });
  }

  if (err instanceof ApiError) {
    return res
      .status(err.statusCode)
      .json({ statusCode: err.statusCode, message: err.message });
  }

  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    statusCode: httpStatus.INTERNAL_SERVER_ERROR,
    message: "server encountered an error",
  });
};

app.use(pino);
app.disable("x-powered-by");

app.use(express.json());

app.use(
  cors({
    origin: "*",
    exposeHeaders: ["Authorization"],
    allowMethods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
    allowHeaders: ["Authorization", "Content-Type", "App"],
    keepHeadersOnError: true,
  })
);

//default error handler
app.use(errorHandler);

module.exports = app;
