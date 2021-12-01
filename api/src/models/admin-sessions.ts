import { getUnixTime } from "date-fns";
import { Schema, Document, model, Model, PopulatedDoc, Types } from "mongoose";
import { AdminAccountDocument } from "./admin-accounts";
import { FranchiseDocument } from "./franchises";

export interface AdminSessionAttrs {
  account: PopulatedDoc<AdminAccountDocument>;
  franchise: PopulatedDoc<FranchiseDocument>;
  createdAt: number;
  expiresAt: number;
  isExpired: string;
}

export interface AdminSessionDocument extends AdminSessionAttrs, Document {}

export interface AdminSessionModel extends Model<AdminSessionDocument> {}

export const adminSessionSchema: Schema = new Schema(
  {
    account: { type: Types.ObjectId, ref: "adminAccounts" },
    franchise: { type: Types.ObjectId, ref: "franchises" },
    createdAt: Number,
    expiresAt: Number,
  },
  {
    collection: "adminSessions",
  }
);

adminSessionSchema.virtual("isExpired").get(function (this: AdminSessionAttrs) {
  return getUnixTime(new Date()) > this.expiresAt;
});

export const AdminSession = model<AdminSessionDocument, AdminSessionModel>(
  "AdminSession",
  adminSessionSchema
);
