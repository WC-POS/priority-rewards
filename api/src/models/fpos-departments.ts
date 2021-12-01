import { Schema, Document, model, Model, PopulatedDoc, Types } from "mongoose";
import { FranchiseDocument } from "./franchises";
import { LocationDocument } from "./locations";

export interface FPOSDepartmentAttrs {
  franchise: PopulatedDoc<FranchiseDocument>;
  location: PopulatedDoc<LocationDocument>;
  name: string;
  description: string;
  group: string;
  isHash: boolean;
  isDeleted: boolean;
}

export interface FPOSDepartmentDocument extends FPOSDepartmentAttrs, Document {}

export interface FPOSDepartmentModel extends Model<FPOSDepartmentDocument> {}

export const fposDepartmentSchema: Schema = new Schema(
  {
    franchise: { type: Types.ObjectId, ref: "franchises" },
    location: { type: Types.ObjectId, ref: "locations" },
    fposId: { type: "String" },
    name: { type: "String" },
    description: { type: "String" },
    group: { type: "String" },
    isHash: { type: "Boolean", default: false },
    isDeleted: { type: "Boolean", default: false },
  },
  {
    collection: "fposDepartments",
  }
);

export const FPOSDepartment = model<
  FPOSDepartmentDocument,
  FPOSDepartmentModel
>("FPOSDepartment", fposDepartmentSchema);
