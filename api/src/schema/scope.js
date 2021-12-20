module.exports = {
  type: "object",
  properties: {
    host: { type: "string" },
    slug: { type: "string" },
    isAdmin: { type: "boolean" },
    isApi: { type: "boolean" },
    franchise: {
      $ref: "Models-Franchise#",
    },
    location: {
      $ref: "Models-Location#",
    },
  },
};
