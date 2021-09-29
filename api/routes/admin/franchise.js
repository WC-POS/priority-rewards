module.exports = async function (fastify, options) {
  fastify.get("/", async function (req, reply) {
    reply.code(200).send(req.scope.franchise);
  });
};
