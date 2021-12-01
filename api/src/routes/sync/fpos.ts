import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { FPOSItemDocument } from "../../models/fpos-items";
import { RouteWithAPIHeaders, RouteWithBody } from "../../utils";

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
