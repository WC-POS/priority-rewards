import { Model, PopulatedDoc, Schema, Types, model } from "mongoose";
import { TimestampAttrs, getUnixTimestamp } from "../utils";

import { AdminAccountDocument } from "./admin-accounts";
import { FranchiseDocument } from "./franchises";
import { getUnixTime } from "date-fns";

export interface AdminAccountRegistraionCodeAttrs {
  account: PopulatedDoc<AdminAccountDocument>;
  franchise: PopulatedDoc<FranchiseDocument>;
  code: string;
  expiresAt: number;
  isValid: boolean;
  isRedeemed: boolean;
  createdAccount: boolean;
  messageId: string;
}

export interface AdminAccountRegistrationCodeDocument
  extends AdminAccountRegistraionCodeAttrs,
    TimestampAttrs,
    Document {}

export interface AdminAccountRegistrationCodeModel
  extends Model<AdminAccountRegistrationCodeDocument> {}

export const adminAccountRegistrationCodeSchema = new Schema(
  {
    account: { type: Types.ObjectId, ref: "adminAccounts" },
    franchise: { type: Types.ObjectId, ref: "franchises" },
    code: String,
    expiresAt: Number,
    isRedeemed: { type: Boolean, default: false },
    isValid: { type: Boolean, default: true },
    createdAccount: { type: Boolean, default: false },
    messageId: { type: String, nullable: true, default: null },
  },
  {
    timestamps: {
      currentTime: getUnixTimestamp,
    },
    collection: "adminAccountRegistrationCodes",
  }
);

adminAccountRegistrationCodeSchema
  .virtual("isExpired")
  .get(function (this: AdminAccountRegistraionCodeAttrs) {
    return getUnixTime(new Date()) < this.expiresAt;
  });

export const AdminAccountRegistrationCode = model<
  AdminAccountRegistrationCodeDocument,
  AdminAccountRegistrationCodeModel
>("AdminAccountRegistraionCode", adminAccountRegistrationCodeSchema);
