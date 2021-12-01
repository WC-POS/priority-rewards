import { Schema, Document, model, Model, PopulatedDoc, Types } from "mongoose";
import { FranchiseDocument } from "./franchises";
import { getUnixTimestamp, TimestampAttrs } from "../utils";

export interface UserPoints {
  lifetime: number;
  current: number;
}

export interface UserAttrs {
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  avatar: string;
  franchise: PopulatedDoc<FranchiseDocument>;
  isVerified: boolean;
  isDeleted: boolean;
  points: UserPoints;
}

export interface UserDocument extends UserAttrs, TimestampAttrs, Document {}

export interface UserModel extends Model<UserDocument> {}

export const userSchema: Schema = new Schema(
  {
    lastName: { type: String, required: true },
    firstName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    avatar: { type: String, default: null, nullable: true },
    franchise: { type: Types.ObjectId, ref: "franchises" },
    isVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    points: {
      lifetime: { type: Number, default: 0 },
      current: { type: Number, default: 0 },
    },
  },
  {
    timestamps: {
      currentTime: getUnixTimestamp,
    },
    collection: "users",
  }
);

export const User = model<UserDocument, UserModel>("User", userSchema);
