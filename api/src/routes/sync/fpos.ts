import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { RouteWithAPIHeaders, RouteWithBody } from "../../utils";

import { FPOSItemDocument } from "../../models/fpos-items";

export default async function (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  fastify.get<RouteWithAPIHeaders>(
    "/",
    {
      preValidation: [fastify.guards.isAPIAuthenticated],
      schema: {
        response: {
          200: {
            $ref: "scope#",
          },
        },
      },
    },
    function (req, reply) {
      console.log(req.headers["sync-private"]);
      reply.code(200).send(req.scope);
    }
  );

  fastify.get<RouteWithAPIHeaders & RouteWithBody<FPOSItemDocument[]>>(
    "/items/",
    {
      preValidation: [fastify.guards.isAPIAuthenticated],
      schema: {
        response: {
          200: {
            type: "array",
            items: {
              $ref: "Models-FPOSItem#",
            },
          },
        },
      },
    },
    async function (req, reply) {
      reply.code(200).send(await fastify.db.models.FPOSItem.find());
    }
  );

  fastify.post<RouteWithAPIHeaders & RouteWithBody<FPOSItemDocument[]>>(
    "/items/",
    {
      preValidation: [fastify.guards.isAPIAuthenticated],
      schema: {
        body: {
          type: "array",
          items: {
            $ref: "Models-FPOSItem#",
          },
        },
      },
    },
    async function (req, reply) {
      reply.code(200).send("Hello");
    }
  );
}
