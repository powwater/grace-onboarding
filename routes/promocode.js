const asyncHandler = require("express-async-handler");
const express = require("express");
const router = express.Router();

const promoHandler = require("../handlers/promocode");

/**
 * Generic promocodes
 */
 router.post(
  "/generic/create",
  asyncHandler(promoHandler.createGenericCode)
);

router.get("/generic", asyncHandler(promoHandler.getAllGenericCodes));

module.exports = router;