import { Schema, Document, model, Model, PopulatedDoc, Types } from "mongoose";
import { FranchiseDocument } from "./franchises";
import { LocationDocument } from "./locations";
import { getUnixTimestamp, TimestampAttrs } from "../utils";

export interface FPOSItemAttrs {
  franchise: PopulatedDoc<FranchiseDocument>;
  location: PopulatedDoc<LocationDocument>;
  fposId: string;
  name: string;
  description: string;
  receiptDescription: string;
  isModifier: boolean;
  isOpenPrice: boolean;
  isNegativePrice: boolean;
  isPromoItem: boolean;
  isTimedItem: boolean;
  defaultPrice: number;
}

export interface FPOSItemDocument
  extends FPOSItemAttrs,
    TimestampAttrs,
    Document {}

export interface FPOSItemModel extends Model<FPOSItemDocument> {}

export const fposItemSchema: Schema = new Schema(
  {
    franchise: { type: Types.ObjectId, ref: "franchise" },
    location: { type: Types.ObjectId, ref: "locations" },
    fposId: { type: "String" },
    name: { type: "String" },
    description: { type: "String" },
    receiptDescription: { type: "String" },
    isModifier: { type: "Boolean" },
    isOpenPrice: { type: "Boolean" },
    isNegativePrice: { type: "Boolean" },
    isPromoItem: { type: "Boolean" },
    isTimedItem: { type: "Boolean" },
    defaultPrice: { type: "Number" },
  },
  {
    timestamps: {
      currentTime: getUnixTimestamp,
    },
    collection: "fposItems",
  }
);

export const FPOSItem = model<FPOSItemDocument, FPOSItemModel>(
  "FPOSItem",
  fposItemSchema
);
