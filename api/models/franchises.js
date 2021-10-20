module.exports = {
  name: "franchises",
  alias: "franchise",
  schema: {
    name: { type: String, required: true },
    displayTitle: {
      title: { type: String },
      superTitle: { type: String },
      subtitle: { type: String },
    },
    logo: {
      location: { type: String, default: "" },
      description: { type: String, default: "" },
      alternativeText: { type: String, default: "" },
    },
    services: {
      promotions: { type: Boolean, default: false },
      events: { type: Boolean, default: false },
      olo: { type: Boolean, default: false },
    },
    contact: {
      website: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
    },
    welcomeMessage: {
      title: { type: String, default: "" },
      body: { type: String, default: "" },
    },
    documents: {
      EULA: { type: String, default: "" },
      termsOfUse: { type: String, default: "" },
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
};
