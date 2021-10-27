module.exports = {
  type: "object",
  properties: {
    host: { type: "string" },
    slug: { type: "string" },
    isAdmin: { type: "boolean" },
    isApi: { type: "boolean" },
    franchise: {
      type: "object",
      $ref: "models-franchises#",
    },
    location: {
      type: "object",
      $ref: "models-locations#",
    },
  },
};
