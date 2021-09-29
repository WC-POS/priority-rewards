const { Types } = require("mongoose").Schema;

module.exports = {
  name: "adminSessions",
  alias: "adminSession",
  schema: {
    account: { type: Types.ObjectId, ref: "adminAccounts" },
    franchise: { type: Types.ObjectId, ref: "franchises" },
    createdAt: Number,
    expiresAt: Number,
  },
  virtual: {
    isExpired: function () {
      return new Date() / 1000 < this.expiresAt;
    },
  },
};
