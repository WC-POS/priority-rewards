module.exports = async function (fastify, options) {
  fastify.get("/", function (req, reply) {
    console.log(req.headers.host.split("."));
    reply.code(200).send(req.scope);
  });
  fastify.get("/util/states/", function (req, reply) {
    const states = require("../lib/utils/states");
    reply.code(200).send(states);
  });
};
