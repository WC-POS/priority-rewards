module.exports = async function (fastify, options) {
  fastify.get(
    "/",
    {
      preValidation: [fastify.guards.isAPIAuthenticated],
      schema: {
        reponse: {
          200: {
            $ref: "scope#",
          },
        },
      },
    },
    function (req, reply) {
      reply.code(200).send(req.scope);
    }
  );
};
