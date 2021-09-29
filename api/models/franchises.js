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
    slug: { type: String },
  },
};
