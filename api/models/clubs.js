const { Types } = require("mongoose").Schema;

module.exports = {
  name: "clubs",
  alias: "club",
  schema: {
    name: { type: String, required: true },
    franchise: { type: Types.ObjectId, ref: "franchises" },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    isEntryClub: { type: Boolean, default: false },
    isExclusiveClub: { type: Boolean, default: false },
    isPaidClub: { type: Boolean, default: false },
    pointsEarnRate: { type: Number, default: 0 },
    minimumPoints: { type: Number, default: 0 },
    paidClubRates: {
      monthly: { type: Number, default: 0 },
      annual: { type: Number, default: 0 },
    },
  },
};
