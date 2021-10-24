const { Types } = require("mongoose").Schema;

module.exports = {
  name: "userSessions",
  alias: "userSession",
  schema: {
    account: { type: Types.ObjectId, ref: "users" },
    franchise: { type: Types.ObjectId, ref: "franchises" },
    expiresAt: Number,
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
