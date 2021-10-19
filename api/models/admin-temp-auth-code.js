const { Types } = require("mongoose").Schema;

module.exports = {
  name: "adminTempAuthCodes",
  alias: "adminTempAuthCode",
  schema: {
    account: { type: Types.ObjectId, ref: "adminAccounts" },
    franchise: { type: Types.ObjectId, ref: "franchises" },
    code: String,
    expiresAt: Number,
    isRedeemed: { type: Boolean, default: false },
    isValid: { type: Boolean, default: true },
    messageId: { type: String, nullable: true },
  },
  schemaOptions: {
    timestamps: true,
  },
  virtual: {
    isExpired: function () {
      return new Date() / 1000 < this.expiresAt;
    },
  },
};
