import { Schema, Document, model, Model, PopulatedDoc, Types } from "mongoose";
import { FranchiseDocument } from "./franchises";
import { LocationDocument } from "./locations";

export enum POSOptions {
  FPOS = "FPOS",
  BLANK = "",
}

export interface POSAPIKeyAttrs {
  franchise: PopulatedDoc<FranchiseDocument>;
  location: PopulatedDoc<LocationDocument>;
  isDeleted: boolean;
  provider: POSOptions;
  public: string;
  private: string;
}

export interface POSAPIKeyDocument extends POSAPIKeyAttrs, Document {}

export interface POSAPIKeyModel extends Model<POSAPIKeyDocument> {}

export const posAPIKeySchema: Schema = new Schema(
  {
    franchise: { type: Types.ObjectId, ref: "franchises" },
    location: { type: Types.ObjectId, ref: "locations" },
    isDeleted: { type: Boolean, default: false },
    provider: { type: String, enum: ["FPOS", ""], default: "" },
    public: { type: String, required: true },
    private: { type: String, required: true },
  },
  {
    collection: "posAPIKeys",
  }
);

export const POSAPIKey = model<POSAPIKeyDocument, POSAPIKeyModel>(
  "POSAPIKey",
  posAPIKeySchema
);
