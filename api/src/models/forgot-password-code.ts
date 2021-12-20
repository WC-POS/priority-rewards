import { Model, PopulatedDoc, Schema, Types, model } from "mongoose";
import { TimestampAttrs, getUnixTimestamp } from "../utils";

import { AdminAccountDocument } from "./admin-accounts";
import { FranchiseDocument } from "./franchises";
import { getUnixTime } from "date-fns";

export interface ForgotPasswordCodeAttrs {
  account: PopulatedDoc<AdminAccountDocument>;
  franchise: PopulatedDoc<FranchiseDocument>;
  code: string;
  expiresAt: number;
  isRedeemed: boolean;
  isValid: boolean;
  changedPassword: boolean;
  messageId: string;
}

export interface ForgotPasswordCodeDocument
  extends ForgotPasswordCodeAttrs,
    TimestampAttrs,
    Document {}

export interface ForgotPasswordCodeModel
  extends Model<ForgotPasswordCodeDocument> {}

export const forgotPasswordCodeSchema: Schema = new Schema(
  {
    account: { type: Types.ObjectId, ref: "adminAccounts" },
    franchise: { type: Types.ObjectId, ref: "franchises" },
    code: String,
    expiresAt: Number,
    isRedeemed: { type: Boolean, default: false },
    isValid: { type: Boolean, default: true },
    changedPassword: { type: Boolean, default: false },
    messageId: { type: String, nullable: true },
  },
  {
    timestamps: {
      currentTime: getUnixTimestamp,
    },
    collection: "forgotPasswordCodes",
  }
);

forgotPasswordCodeSchema
  .virtual("isExpired")
  .get(function (this: ForgotPasswordCodeAttrs) {
    return getUnixTime(new Date()) < this.expiresAt;
  });

export const ForgotPasswordCode = model<
  ForgotPasswordCodeDocument,
  ForgotPasswordCodeModel
>("ForgotPasswordCode", forgotPasswordCodeSchema);
