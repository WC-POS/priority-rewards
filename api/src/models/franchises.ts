import { Schema, Document, model, Model } from "mongoose";

export interface DisplayTitle {
  title: string;
  superTitle: string;
  subtitle: string;
}

export interface FranchiseContact {
  website: string;
  email: string;
  phone: string;
}

export interface FranchiseDocuments {
  EULA: string;
  termsOfUse: string;
}

export interface FranchiseLogo {
  location: string;
  description: string;
  alternativeText: string;
}

export interface FranchisePayment {
  provider: PaymentProvider;
  public: string;
  private: string;
}

export interface FranchiseServices {
  promotions: boolean;
  events: boolean;
  olo: boolean;
}

export interface FranchiseWelcomeMessage {
  title: string;
  body: string;
}

export interface FranchiseAttrs {
  name: string;
  displayTitle: DisplayTitle;
  logo: FranchiseLogo;
  services: FranchiseServices;
  contact: FranchiseContact;
  welcomeMessage: FranchiseWelcomeMessage;
  documents: FranchiseDocuments;
  payment: FranchisePayment;
  slug: string;
}

export enum PaymentProvider {
  Authorize = "AUTHORIZE.NET",
  Stripe = "STRIPE",
  Blank = "",
}

export interface FranchiseDocument extends Document {
  name: string;
  displayTitle: DisplayTitle;
  logo: FranchiseLogo;
  services: FranchiseServices;
  contact: FranchiseContact;
  welcomeMessage: FranchiseWelcomeMessage;
  documents: FranchiseDocuments;
  payment: FranchisePayment;
  slug: string;
}

export interface FranchiseModel extends Model<FranchiseDocument> {}

export const franchiseSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    displayTitle: {
      title: { type: String },
      superTitle: { type: String },
      subtitle: { type: String },
    },
    logo: {
      location: { type: String, default: "" },
      description: { type: String, default: "" },
      alternativeText: { type: String, default: "" },
    },
    services: {
      promotions: { type: Boolean, default: false },
      events: { type: Boolean, default: false },
      olo: { type: Boolean, default: false },
    },
    contact: {
      website: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
    },
    welcomeMessage: {
      title: { type: String, default: "" },
      body: { type: String, default: "" },
    },
    documents: {
      EULA: { type: String, default: "" },
      termsOfUse: { type: String, default: "" },
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
    collection: "franchises",
  }
);

export const Franchise = model<FranchiseDocument, FranchiseModel>(
  "Franchise",
  franchiseSchema
);
