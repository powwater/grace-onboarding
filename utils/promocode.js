const uuid = require("uuid");
const nanoid = require("nanoid");
const query = require("../queries");

//Letters I,i,L,l,O,o and number 0 have been removed to reduce confusion among users.
const genCode = nanoid.customAlphabet(
  "1234556789ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz",
  4
);

const createPromoMeta = async (prefixObj) => {

  //some promocodes e.g. unique and generic have an offer(discount or delivery)
  const {
    referrerId,
    prefix,
    campaign,
    campaignDesc,
    quantity,
    offer,
    purchases,
    startDate,
    endDate,
  } = prefixObj;

  const promoMeta = {
    id: uuid.v4(),
    prefix: prefix,
    quantity: quantity,
  };

  if (campaign) {
    promoMeta.campaign = campaign;
  }

  if (purchases) {
    promoMeta.purchases = purchases;
  }

  if (campaignDesc) {
    promoMeta.campaign_desc = campaignDesc;
  }

  if (referrerId) {
    promoMeta.customer_id = referrerId;
  }

  if (startDate) {
    promoMeta.start_date = startDate;
  }

  if (endDate) {
    promoMeta.end_date = endDate;
  }

  if (offer && offer.delivery) {
    promoMeta.delivery = offer.delivery;
  }

  if (offer && offer.discount) {
    promoMeta.discount = offer.discount;
  }

  return await query.promoMeta.create(promoMeta);
}


const createGenericCode = async ({
  prefix,
  startDate,
  endDate,
  quantity,
  offer,
  campaign,
  campaignDesc,
}) => {
  const [promoMeta] = await createPromoMeta({
    prefix,
    campaign,
    campaignDesc,
    quantity,
    startDate,
    endDate,
    offer,
  });

  let refPromocodes = [];

  // why start from 0... it means if the quantity is 2 there will be 3 items
  for (let i = 0; i < quantity; i++) {
    let refPromocode = {};

    refPromocode.id = uuid.v4();
    refPromocode.code = prefix + "_" + genCode();
    refPromocode.meta_id = promoMeta.id;
    refPromocodes.push(refPromocode);
  }

  let rows = await query.genericPromo.create(refPromocodes);

  return rows.length;
}

module.exports = {
  createGenericCode,
};