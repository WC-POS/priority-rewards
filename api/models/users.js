const { Types } = require("mongoose").Schema;

module.exports = {
  name: "users",
  alias: "user",
  schema: {
    lastName: { type: String, required: true },
    firstName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    avatar: { type: String, default: null, nullable: true },
    franchise: { type: Types.ObjectId, ref: "franchises" },
    isVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    points: {
      lifetime: { type: Number, default: 0 },
      current: { type: Number, default: 0 },
    },
  },
  schemaOptions: {
    timestamps: true,
  },
  virtual: {
    fullName: function () {
      return `${this.firstName}${this.lastName ? " " + this.lastName : ""}`;
    },
  },
};
