import bcrypt from "bcrypt";
import { getUnixTime } from "date-fns";
import { FastifyInstance } from "fastify";
import {
  FastifyReply,
  FastifyRequest,
  FastifyPluginCallback,
  FastifyPluginOptions,
} from "fastify";
import fp from "fastify-plugin";
import { doneFn } from "../utils";

import { FranchiseDocument } from "../models/franchises";
import { LocationDocument } from "../models/locations";
import { AdminSessionDocument } from "../models/admin-sessions";
import { AdminAccountDocument } from "../models/admin-accounts";

export interface StandardScope {
  host?: string;
  slug: string;
  isAdmin: boolean;
  isApi: boolean;
}

export interface ExtendedScope extends StandardScope {
  franchise?: FranchiseDocument | null;
  location?: LocationDocument | null;
}

export interface GetStandardScopeFn {
  (req: FastifyRequest): StandardScope;
}

declare module "fastify" {
  export interface FastifyRequest {
    scope: ExtendedScope;
    adminAccount?: AdminAccountDocument;
    adminSession?: AdminSessionDocument;
  }
}

const guardFunctions: FastifyPluginCallback<FastifyPluginOptions> = (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions,
  done: doneFn
) => {
  const accessDeniedBody = {
    error: "Access denied. Please login to continue.",
  };

  const getStandardScope: GetStandardScopeFn = function (req: FastifyRequest) {
    let slug = "";
    if (req.headers && req.headers.host) {
      slug = req.headers.host.toLowerCase().split(".")[0];
    }
    return {
      host: req.headers.host,
      slug,
      isAdmin: slug === "admin",
      isApi: slug === "api",
    };
  };

  const isPublic = async function (req: FastifyRequest) {
    const standardScope = getStandardScope(req);
    if (!standardScope.isAdmin && !standardScope.isApi) {
      const franchise = await fastify.db.models.Franchise.findOne({
        slug: standardScope.slug,
      });
      req.scope = { ...standardScope, franchise, location: null };
    } else {
      req.scope = { ...standardScope, franchise: null, location: null };
    }
  };

  const isAdminAuthenticated = async function (
    req: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      let token;
      if (req.headers.authorization) {
        token = await fastify.jwt.decode(
          req.headers.authorization.replace("Bearer ", "")
        );
        const adminSession = await fastify.db.models.AdminSession.findOne({
          _id: token.session,
          expiresAt: { $gt: getUnixTime(new Date()) },
        });
        if (adminSession) {
          const adminAccount = await fastify.db.models.AdminAccount.findOne({
            _id: adminSession.account,
            franchise: adminSession.franchise._id,
          });
          const franchise = await fastify.db.models.Franchise.findById(
            adminSession.franchise
          );
          if (adminAccount && franchise) {
            req.adminSession = adminSession;
            req.adminAccount = adminAccount;
            req.scope = {
              ...getStandardScope(req),
              franchise,
              location: null,
            };
          } else {
            reply.code(401).send(accessDeniedBody);
          }
        } else {
          reply.code(401).send(accessDeniedBody);
        }
      } else {
        reply.code(401).send(accessDeniedBody);
      }
    } catch (err) {
      console.log(err);
      reply.code(500).send({ error: err });
    }
  };

  const isAPIAuthenticated = async function (
    req: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      if (req.headers["sync-public"] && req.headers["sync-private"]) {
        const apiKey = await fastify.db.models.POSAPIKey.findOne({
          public: req.headers["sync-public"] as string,
          isDeleted: false,
        });
        if (apiKey) {
          const isValidKey = await bcrypt.compare(
            req.headers["sync-private"] as string,
            apiKey.private
          );
          if (isValidKey) {
            const franchise = await fastify.db.models.Franchise.findById(
              apiKey.franchise
            );
            const location = await fastify.db.models.Location.findById(
              apiKey.location
            );
            if (franchise && location) {
              req.scope = {
                ...getStandardScope(req),
                franchise,
                location,
              };
            } else {
              reply.code(401).send(accessDeniedBody);
            }
          } else {
            reply.code(401).send(accessDeniedBody);
          }
        } else {
          reply.code(401).send(accessDeniedBody);
        }
      } else {
        reply.code(401).send(accessDeniedBody);
      }
    } catch (err) {
      console.log(err);
      reply.code(500).send({ error: err });
    }
  };

  fastify.decorate("guards", {
    isAdminAuthenticated,
    isAPIAuthenticated,
    isPublic,
  });
  done();
};

declare module "fastify" {
  export interface FastifyInstance {
    guards: {
      getStandardScope: GetStandardScopeFn;
      isAdminAuthenticated: (req: FastifyRequest, reply: FastifyReply) => void;
      isAPIAuthenticated: (req: FastifyRequest, reply: FastifyReply) => void;
      isPublic: (req: FastifyRequest) => void;
    };
  }
}

export default fp(guardFunctions);
