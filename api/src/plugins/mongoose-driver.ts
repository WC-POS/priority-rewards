import { FastifyInstance } from "fastify";
import { FastifyPluginAsync, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";
import { Module } from "module";
import mongoose, { Schema, SchemaType, Types } from "mongoose";
// Models
import { AdminAccount, AdminAccountModel } from "../models/admin-accounts";
import { AdminSession, AdminSessionModel } from "../models/admin-sessions";
import {
  AdminTempAuthCode,
  AdminTempAuthCodeModel,
} from "../models/admin-temp-auth-code";
import { Club, ClubModel } from "../models/clubs";
import {
  FPOSDepartment,
  FPOSDepartmentModel,
} from "../models/fpos-departments";
import { FPOSItem, FPOSItemModel } from "../models/fpos-items";
import { Franchise, FranchiseModel } from "../models/franchises";
import { Location, LocationModel } from "../models/locations";
import { POSAPIKey, POSAPIKeyModel } from "../models/pos-api-key";
import { UserSession, UserSessionModel } from "../models/user-sessions";
import { User, UserModel } from "../models/users";

export interface Models {
  AdminAccount: AdminAccountModel;
  AdminSession: AdminSessionModel;
  AdminTempAuthCode: AdminTempAuthCodeModel;
  Club: ClubModel;
  FPOSDepartment: FPOSDepartmentModel;
  FPOSItem: FPOSItemModel;
  Franchise: FranchiseModel;
  Location: LocationModel;
  POSAPIKey: POSAPIKeyModel;
  User: UserModel;
  UserSession: UserSessionModel;
}

// Options
export interface MongoosePluginOptions {
  uri: string;
  connectionSettings: {
    useNewUrlParser: boolean;
    useUnifiedTopology: boolean;
  };
}

export interface DB {
  models: Models;
}

interface FSchemaProp {
  type: string;
  properties?: {
    [key: string]: FSchemaProp;
  };
}

interface FSchemaObject {
  $id: string;
  type: string;
  properties?: {
    [key: string]: FSchemaProp;
  };
}

function convertSchemaType(type: SchemaType): string {
  if (type.instance.toLowerCase() === "objectid") {
    return "string";
  } else if (type.instance.toLowerCase() === "date") {
    return "number";
  } else {
    return type.instance.toLowerCase();
  }
}

function buildFastifySchema<T extends Schema>(
  schema: T,
  id: string
): FSchemaObject {
  const fSchema = {
    $id: id,
    type: "object",
    properties: {},
  } as FSchemaObject;
  schema.eachPath((path, type) => {
    const splitPath = path.split(".");
    if (path === "__v") {
      return;
    } else if (splitPath.length === 1) {
      fSchema.properties![path] = {
        type: convertSchemaType(type),
      } as FSchemaProp;
    } else {
      if (fSchema.properties![splitPath[0]] === undefined) {
        fSchema.properties![splitPath[0]] = {
          type: "object",
          properties: {},
        } as FSchemaProp;
      }
      fSchema.properties![splitPath[0]].properties![splitPath[1]] = {
        type: convertSchemaType(type),
      };
    }
  });
  return fSchema;
}

const connect: FastifyPluginAsync<MongoosePluginOptions> = async (
  fastify,
  options: FastifyPluginOptions
) => {
  try {
    mongoose.connection.on("connected", () => {
      fastify.log.info({ actor: "MongoDB" }, "connected");
    });
    mongoose.connection.on("disconnected", () => {
      fastify.log.error({ actor: "MongoDB" }, "disconnected");
    });
    await mongoose.connect(options.uri, options.connectionSettings);
    const models: Models = {
      AdminAccount,
      AdminSession,
      AdminTempAuthCode,
      Club,
      FPOSDepartment,
      FPOSItem,
      Franchise,
      Location,
      POSAPIKey,
      User,
      UserSession,
    };
    Object.entries(models).forEach(([modelName, modelObj]) => {
      fastify.addSchema(
        buildFastifySchema(modelObj.schema, `Models-${modelName}`)
      );
    });
    fastify.decorate("db", { models });
  } catch (err) {
    console.error(err);
  }
};

declare module "fastify" {
  export interface FastifyInstance {
    db: DB;
  }
}

export default fp(connect);
