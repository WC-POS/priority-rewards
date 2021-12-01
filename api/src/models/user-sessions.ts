import { getUnixTime } from "date-fns";
import { Schema, Document, model, Model, PopulatedDoc, Types } from "mongoose";
import { AccountDocument } from "./accounts";
import { FranchiseDocument } from "./franchises";
import { getUnixTimestamp } from "../utils";

export interface UserSessionAttrs {
  account: PopulatedDoc<AccountDocument>;
  franchise: PopulatedDoc<FranchiseDocument>;
  expiresAt: number;
}

export interface UserSessionDocument extends UserSessionAttrs, Document {}

export interface UserSessionModel extends Model<UserSessionDocument> {}

export const userSessionSchema: Schema = new Schema(
  {
    account: { type: Types.ObjectId, ref: "users" },
    franchise: { type: Types.ObjectId, ref: "franchises" },
    expiresAt: Number,
  },
  {
    timestamps: {
      currentTime: getUnixTimestamp,
    },
    collection: "userSessions",
  }
);

userSessionSchema.virtual("isExpired").get(function (this: UserSessionAttrs) {
  return getUnixTime(new Date()) > this.expiresAt;
});

export const UserSession = model<UserSessionDocument, UserSessionModel>(
  "UserSession",
  userSessionSchema
);
