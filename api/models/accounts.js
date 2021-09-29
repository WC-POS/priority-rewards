module.exports = {
  name: "accounts",
  alias: "Account",
  schema: {
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, nullable: true },
    password: { type: String, required: true },
    twoFactorEnabled: { type: Boolean, default: false },
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
