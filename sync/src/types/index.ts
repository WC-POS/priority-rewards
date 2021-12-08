import { Department } from 'main/models/FPOS/Department';
import { ErrorMsg } from 'main/util';
import { Item } from 'main/models/FPOS/Item';

export enum PaymentProvider {
  Authorize = 'AUTHORIZE.NET',
  Stripe = 'STRIPE',
  Blank = '',
}

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

export interface Franchise {
  _id: string;
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

export interface Location {
  _id: string;
  franchise: string;
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
  updatedAt: number;
}

export interface SettingsConfig {
  API: {
    publicKey: string;
    privateKey: string;
  };
  FPOS: {
    host: string;
    user: string;
    password: string;
    database: string;
  };
  LOG: {
    database: string;
  };
  encrypted?: boolean;
}

export enum IpcChannels {
  error = 'error',
  example = 'ipc-example',
  ping = 'ping',
}

export interface IpcCallbackFn<T = void, U = void, V = void, W = void> {
  (t?: T, u?: U, v?: V, w?: W): void;
}

export interface IpcEventListener<T = void, U = void, V = void, W = void> {
  (channel: IpcChannels, callback: IpcCallbackFn<T, U, V, W>): void;
}

export interface StatusInfo {
  connected: boolean;
  db: {
    host: string;
    name: string;
  };
}

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        clearConfigSave: () => void;
        clearConnect: () => void;
        clearError: () => void;
        getConfig: () => Promise<SettingsConfig>;
        getDepartments: () => Promise<Department[]>;
        getItem: (id: string) => Promise<Item | undefined>;
        getItems: () => Promise<Item[]>;
        setConfig: (config: SettingsConfig) => Promise<SettingsConfig>;
        onConnect: (callback: (info: StatusInfo) => void) => void;
        onError: (callback: (error: ErrorMsg) => void) => void;
        onConfigSave: (callback: (config: SettingsConfig) => void) => void;
      };
    };
  }
}
