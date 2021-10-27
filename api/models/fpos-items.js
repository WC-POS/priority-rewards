const { Types } = require("mongoose").Schema;

module.exports = {
  name: "fposItems",
  alias: "fposItem",
  schema: {
    franchise: { type: Types.ObjectId, ref: "franchise" },
    location: { type: Types.ObjectId, ref: "locations" },
    fposId: { type: "String" },
    name: { type: "String" },
    description: { type: "String" },
    receiptDescription: { type: "String" },
    isModifier: { type: "Boolean" },
    isOpenPrice: { type: "Boolean" },
    isNegativePrice: { type: "Boolean" },
    isPromoItem: { type: "Boolean" },
    isTimedItem: { type: "Boolean" },
    defaultPrice: { type: "Number" },
  },
  schemaOptions: {
    timestamps: true,
  },
};
