import { getUnixTime } from "date-fns";
import { Schema, Document, model, Model, PopulatedDoc, Types } from "mongoose";
import { AdminAccountDocument } from "./admin-accounts";
import { FranchiseDocument } from "./franchises";
import { getUnixTimestamp, TimestampAttrs } from "../utils";

export interface AdminTempAuthCodeAttrs {
  account: PopulatedDoc<AdminAccountDocument>;
  franchise: PopulatedDoc<FranchiseDocument>;
  code: string;
  expiresAt: number;
  isRedeemed: boolean;
  isValid: boolean;
  messageId: string;
}

export interface AdminTempAuthCodeDocument
  extends AdminTempAuthCodeAttrs,
    TimestampAttrs,
    Document {}

export interface AdminTempAuthCodeModel
  extends Model<AdminTempAuthCodeDocument> {}

export const adminTempCodeSchema: Schema = new Schema(
  {
    account: { type: Types.ObjectId, ref: "adminAccounts" },
    franchise: { type: Types.ObjectId, ref: "franchises" },
    code: String,
    expiresAt: Number,
    isRedeemed: { type: Boolean, default: false },
    isValid: { type: Boolean, default: true },
    messageId: { type: String, nullable: true },
  },
  {
    timestamps: {
      currentTime: getUnixTimestamp,
    },
    collection: "adminTempAuthCodes",
  }
);

adminTempCodeSchema
  .virtual("isExpired")
  .get(function (this: AdminTempAuthCodeAttrs) {
    return getUnixTime(new Date()) < this.expiresAt;
  });

export const AdminTempAuthCode = model<
  AdminTempAuthCodeDocument,
  AdminTempAuthCodeModel
>("AdminTempAuthCode", adminTempCodeSchema);
