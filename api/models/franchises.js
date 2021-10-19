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
      location: { type: String, nullable: true },
      description: { type: String, nullable: true },
      alternativeText: { type: String, nullable: true },
    },
    services: {
      promotions: { type: Boolean, default: false },
      events: { type: Boolean, default: false },
      olo: { type: Boolean, default: false },
    },
    contact: {
      website: { type: String, nullable: true },
      email: { type: String, nullable: true },
      phone: { type: String, nullable: true },
    },
    welcomeMessage: {
      title: { type: String, nullable: true },
      body: { type: String, nullable: true },
    },
    documents: {
      EULA: { type: String, nullable: true },
      termsOfUse: { type: String, nullable: true },
    },
    payment: {
      provider: {
        type: String,
        choices: ["AUTHORIZE.NET", "STRIPE", null],
        nullable: true,
        default: null,
      },
      public: { type: String, nullable: true, default: null },
      private: { type: String, nullable: true, default: null },
    },
    slug: { type: String },
  },
};
