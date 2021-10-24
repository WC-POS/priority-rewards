module.exports = {
  type: ["object", "null"],
  properties: {
    page: { type: "number", default: 1 },
    size: { type: "number", default: process.env.PAGE_SIZE },
  },
};
