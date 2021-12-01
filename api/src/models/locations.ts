import { Schema, Document, model, Model, PopulatedDoc, Types } from "mongoose";
import { FranchiseDocument, FranchisePayment } from "./franchises";
import { getUnixTimestamp, TimestampAttrs } from "../utils";

export interface LocationAddress {
  street1: string;
  street2: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface LocationContact {
  website: string;
  email: string;
  phone: string;
}

export interface LocationDisplay {
  name: boolean;
  address: boolean;
  note: boolean;
  previewImage: boolean;
  services: boolean;
  contactSite: boolean;
  contactEmail: boolean;
  contactPhone: boolean;
}

export interface LocationServices {
  promotions: boolean;
  events: boolean;
  olo: boolean;
}

export interface LocationPreviewImage {
  location: string;
  alternativeText: string;
}

export interface LocationAttrs {
  franchise: PopulatedDoc<FranchiseDocument>;
  name: string;
  isActive: boolean;
  address: LocationAddress;
  contact: LocationContact;
  display: LocationDisplay;
  note: string;
  services: LocationServices;
  previewImage: LocationPreviewImage;
  payment: FranchisePayment;
  slug: string;
}

export interface LocationDocument
  extends LocationAttrs,
    TimestampAttrs,
    Document {}

export interface LocationModel extends Model<LocationDocument> {}

export const locationSchema: Schema = new Schema(
  {
    franchise: { type: Types.ObjectId, ref: "franchises" },
    name: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    address: {
      street1: { type: String, default: "" },
      street2: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      zipCode: { type: String, default: "" },
    },
    contact: {
      website: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
    },
    display: {
      name: { type: Boolean, default: true },
      address: { type: Boolean, default: true },
      note: { type: Boolean, default: true },
      previewImage: { type: Boolean, default: true },
      services: { type: Boolean, default: false },
      contactSite: { type: Boolean, default: false },
      contactEmail: { type: Boolean, default: true },
      contactPhone: { type: Boolean, default: true },
    },
    note: { type: String, nullable: true, default: "" },
    services: {
      promotions: { type: Boolean, default: false },
      events: { type: Boolean, default: false },
      olo: { type: Boolean, default: false },
    },
    previewImage: {
      location: { type: String, default: "" },
      alternativeText: { type: String, default: "" },
    },
    payment: {
      provider: {
        type: String,
        enum: ["AUTHORIZE.NET", "STRIPE", ""],
        default: "",
      },
      public: { type: String, default: "" },
      private: { type: String, default: "" },
    },
    slug: { type: String },
  },
  {
    timestamps: {
      currentTime: getUnixTimestamp,
    },
    collection: "locations",
  }
);

export const Location = model<LocationDocument, LocationModel>(
  "Location",
  locationSchema
);
