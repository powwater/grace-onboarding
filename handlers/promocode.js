const promoService = require("../utils/promocode");
const query = require("../queries")

 async function createGenericCode(req, res, next) {

  let totalCodes = await promoService.createGenericCode(req.body);

  if (totalCodes < 1) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      httpStatus[`${httpStatus.INTERNAL_SERVER_ERROR}_MESSAGE`]
    );
  }

  return res
    .status(httpStatus.CREATED)
    .json({ statusCode: httpStatus.CREATED, created: totalCodes });
}

async function getAllGenericCodes(req, res, next) {
  if (req.query.pref) {
    return getGenericCodeWithMetadata(req.query.pref, res, next);
  }

  let promos = await query.genericPromo.allCodes();

  if (!promos) {
    throw new ApiError(httpStatus.NOT_FOUND, ApiError.PromocodeNotFoundErr);
  }

  return res
    .status(httpStatus.OK)
    .json({ statusCode: httpStatus.OK, total: promos.length, promos });
}

module.exports = {
  createGenericCode,
  getAllGenericCodes
};