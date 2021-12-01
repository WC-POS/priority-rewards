import { Schema, Document, model, Model, PopulatedDoc, Types } from "mongoose";
import { FranchiseDocument } from "./franchises";
import { getUnixTimestamp, TimestampAttrs } from "../utils";

export const AdminAccountFSchema = {
  $id: "models-admin-accounts",
  type: "object",
  properties: {
    email: "string",
    password: "string",
    lastName: "string",
    firstName: "string",
    franchise: "string",
    isSiteAdmin: "boolean",
  },
};

export interface AdminAccountAttrs {
  email: string;
  password: string;
  lastName: string;
  firstName: string;
  franchise: PopulatedDoc<FranchiseDocument>;
  fullname: string;
  isSiteAdmin: boolean;
}

export interface AdminAccountDocument
  extends AdminAccountAttrs,
    TimestampAttrs,
    Document {}

export interface AdminAccountModel extends Model<AdminAccountDocument> {}

export const adminAccountSchema: Schema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    lastName: { type: String },
    firstName: { type: String },
    franchise: { type: Types.ObjectId, ref: "franchises" },
  },
  {
    timestamps: {
      currentTime: getUnixTimestamp,
    },
    collection: "adminAccounts",
  }
);

adminAccountSchema.virtual("fullname").get(function (this: AdminAccountAttrs) {
  return `${this.firstName}${this.lastName ? " " + this.lastName : ""}`;
});

adminAccountSchema
  .virtual("isSiteAdmin")
  .get(function (this: AdminAccountAttrs) {
    return this.franchise === null;
  });

export const AdminAccount = model<AdminAccountDocument, AdminAccountModel>(
  "AdminAccount",
  adminAccountSchema
);
