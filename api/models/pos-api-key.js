const { Types } = require("mongoose").Schema;

module.exports = {
  name: "posAPIKeys",
  alias: "posAPIKey",
  schema: {
    franchise: { type: Types.ObjectId, ref: "franchises" },
    location: { type: Types.ObjectId, ref: "locations" },
    isDeleted: { type: Boolean, default: false },
    provider: { type: String, enum: ["FPOS", ""], default: "" },
    public: { type: String, required: true },
    private: { type: String, required: true },
  },
};
