const { Types } = require("mongoose").Schema;

module.exports = {
  name: "locations",
  alias: "location",
  schema: {
    franchise: { type: Types.ObjectId, ref: "franchises" },
    name: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    address: {
      street1: { type: String, default: "" },
      street2: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      zipCode: { type: String, default: "" },
    },
    contact: {
      website: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
    },
    display: {
      name: { type: Boolean, default: true },
      address: { type: Boolean, default: true },
      note: { type: Boolean, default: true },
      previewImage: { type: Boolean, default: true },
      services: { type: Boolean, default: false },
      contactSite: { type: Boolean, default: false },
      contactEmail: { type: Boolean, default: true },
      contactPhone: { type: Boolean, default: true },
    },
    note: { type: String, nullable: true, default: "" },
    pos: {
      provider: { type: String, enum: ["FPOS", ""], default: "" },
      public: { type: String, default: "" },
      private: { type: String, default: "" },
    },
    services: {
      promotions: { type: Boolean, default: false },
      events: { type: Boolean, default: false },
      olo: { type: Boolean, default: false },
    },
    previewImage: {
      location: { type: String, default: "" },
      alternativeText: { type: String, default: "" },
    },
    payment: {
      provider: {
        type: String,
        enum: ["AUTHORIZE.NET", "STRIPE", ""],
        default: "",
      },
      public: { type: String, default: "" },
      private: { type: String, default: "" },
    },
    slug: { type: String },
  },
  schemaOptions: {
    timestamps: true,
  },
};
