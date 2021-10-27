const { Types } = require("mongoose").Schema;

module.exports = {
  name: "fposDepartments",
  alias: "fposDepartment",
  schema: {
    franchise: { type: Types.ObjectId, ref: "franchises" },
    location: { type: Types.ObjectId, ref: "locations" },
    fposId: { type: "String" },
    name: { type: "String" },
    description: { type: "String" },
    group: { type: "String" },
    isHash: { type: "Boolean", default: false },
    isDeleted: { type: "Boolean", default: false },
  },
};
