const { Types } = require("mongoose").Schema;

module.exports = {
  name: "adminAccounts",
  alias: "adminAccount",
  schema: {
    email: { type: String, required: true },
    password: { type: String, required: true },
    lastName: { type: String },
    firstName: { type: String },
    franchise: { type: Types.ObjectId, ref: "franchises" },
  },
  schemaOptions: {
    timestamps: true,
  },
  virtual: {
    fullName: function () {
      return `${this.firstName}${this.lastName ? " " + this.lastName : ""}`;
    },
    isSiteAdmin: function () {
      return this.franchise === null;
    },
  },
};
