import { Schema, Document, model, Model, PopulatedDoc, Types } from "mongoose";
import { FranchiseDocument } from "./franchises";

export interface PaidClubRates {
  monthly: number;
  annual: number;
}

export interface ClubAttrs {
  name: string;
  franchise: PopulatedDoc<FranchiseDocument>;
  isActive: boolean;
  isDeleted: boolean;
  isEntryClub: boolean;
  isExclusiveClub: boolean;
  isPaidClub: boolean;
  pointsEarnRate: number;
  minimumPoints: number;
  paidClubRates: PaidClubRates;
}

export interface ClubDocument extends ClubAttrs, Document {}

export interface ClubModel extends Model<ClubDocument> {}

export const clubSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    franchise: { type: Types.ObjectId, ref: "franchises" },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    isEntryClub: { type: Boolean, default: false },
    isExclusiveClub: { type: Boolean, default: false },
    isPaidClub: { type: Boolean, default: false },
    pointsEarnRate: { type: Number, default: 0 },
    minimumPoints: { type: Number, default: 0 },
    paidClubRates: {
      monthly: { type: Number, default: 0 },
      annual: { type: Number, default: 0 },
    },
  },
  {
    collection: "clubs",
  }
);

export const Club = model<ClubDocument, ClubModel>("Club", clubSchema);
