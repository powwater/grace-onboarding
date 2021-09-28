const uuid = require("uuid");
const nanoid = require("nanoid");
const query = require("../queries");

const types = {
  REFERRAL: "referral",
  GENERIC: "generic",
  UNIQUE: "unique",
};
//Letters I,i,L,l,O,o and number 0 have been removed to reduce confusion among users.
const genCode = nanoid.customAlphabet(
  "1234556789ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz",
  4
);

async function createPromoMeta(prefixObj) {
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

/**
 * @description creates a new referral code unique to each referrer (customer who will refer others).
 * @param {string} firstname The referrer's firstname
 * @param {string} lastname  The referrer's lastname
 * @returns unique referral code
 */
async function createReferralCode(firstname, lastname, referrerId) {
  const prefix = firstname.charAt(0) + lastname.charAt(0);
  const code = prefix + "_" + genCode();

  const [promoMeta] = await createPromoMeta({
    prefix,
    quantity: 1,
    referrerId,
  });

  const refPromo = {
    id: uuid.v4(),
    code: code,
    meta_id: promoMeta.id,
  };

  const returnables = ["id", "code"];
  const [promocode] = await query.referralPromo.create(refPromo, returnables);

  return promocode;
}

async function checkReferer(referralCode) {
  //check whether the referral code exists
  return query.referralPromo.byCode(referralCode);
}

async function createGenericCode({
  prefix,
  startDate,
  endDate,
  quantity,
  offer,
  campaign,
  campaignDesc,
}) {
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

async function createUniqueCode({
  beneficiary,
  phonenumber,
  startDate,
  endDate,
  prefix,
  purchases,
  offer,
}) {
  const [promoMeta] = await createPromoMeta({
    prefix,
    purchases,
    startDate,
    endDate,
    offer,
  });

  const pCode = {
    id: uuid.v4(),
    code: prefix + "_" + genCode(),
    beneficiary_phone: phonenumber,
    beneficiary: beneficiary,
    meta_id: promoMeta.id,
  };

  const pUnique = await query.uniquePromo.create(pCode);

  const uPromo = {
    id: pUnique.id,
    code: pUnique.code,
    beneficiary: pUnique.beneficiary,
    beneficiaryPhone: pUnique.beneficiary_phone,
    purchases: promoMeta.purchases,
    startDate: promoMeta.start_date,
    endDate: promoMeta.end_date,
    offer: { discount: promoMeta.discount, delivery: promoMeta.delivery },
  };

  return uPromo;
}

module.exports = {
  types,
  createReferralCode,
  createGenericCode,
  createUniqueCode,
  checkReferer,
};
