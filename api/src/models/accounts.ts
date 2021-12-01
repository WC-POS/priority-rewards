import { Schema, Document, model, Model } from "mongoose";
import { getUnixTimestamp, TimestampAttrs } from "../utils";

export const AccountFSchema = {
  $id: "models-accounts",
  type: "object",
  properties: {
    email: "string",
    firstName: "string",
    lastName: "string",
    password: "string",
    twoFactorEnabled: "string",
  },
};

export interface AccountAttrs {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  twoFactorEnabled: boolean;
}

export interface AccountDocument
  extends AccountAttrs,
    TimestampAttrs,
    Document {}

export interface AccountModel extends Model<AccountDocument> {}

export const accountSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, nullable: true },
    password: { type: String, required: true },
    twoFactorEnabled: { type: Boolean, default: false },
  },
  {
    timestamps: {
      currentTime: getUnixTimestamp,
    },
    collection: "accounts",
  }
);

accountSchema.virtual("fullname").get(function (this: AccountAttrs) {
  return `${this.firstName}${this.lastName ? " " + this.lastName : ""}`;
});

export const Account = model<AccountDocument, AccountModel>(
  "Account",
  accountSchema
);
