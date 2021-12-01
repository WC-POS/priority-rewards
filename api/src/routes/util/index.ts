import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { states } from "../../utils/states";

export default async (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) => {
  fastify.get(
    "states/",
    {
      schema: {
        response: {
          200: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                abbreviation: { type: "string" },
              },
            },
          },
        },
      },
    },
    function (req, reply) {
      reply.code(200).send(states);
    }
  );
};
