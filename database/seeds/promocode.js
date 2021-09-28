exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("promo")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("promo").insert([
        {
          id: "f975f1c2-23f9-4343-a9ac-012f2f9874rt",
          creator: "admin",
          code: "YHIG",
          code_type: "generic",
          discount: 50,
          delivery: 0,
          slogan: "water is life",
          active: "true",
          redeemed: false,
          created_at: "2021-08-12T10:09:21.071Z",
          updated_at: "2021-08-12T12:08:01.979Z",
        },
        {
          id: "f975f1c2-23g9-4343-a9ac-012f2f987484",
          creator: "system",
          code: "IJBO",
          code_type: "referral",
          discount: 89,
          delivery: 0,
          active: "true",
          slogan: "water is life",
          redeemed: false,
          created_at: "2021-08-12T10:09:21.071Z",
          updated_at: "2021-08-12T12:08:01.979Z",
        },
        {
          id: "f975g1c2-23f9-4343-a9ac-012f2f987484",
          creator: "admin",
          beneficiary: "Octopizzo",
          beneficiary_phone: "+254729080765",
          code: "KYB0",
          code_type: "unique",
          discount: 0,
          delivery: 100,
          slogan: "water is life",
          active: "true",
          redeemed: false,
          created_at: "2021-08-12T10:09:21.071Z",
          updated_at: "2021-08-12T12:08:01.979Z",
        },
      ]);
    });
};
