const bcrypt = require("bcrypt");
const fastifyPlugin = require("fastify-plugin");

function franchiseScope(fastify, opts, done) {
  const getFranchiseScope = async function (req, reply) {
    const slug = req.headers.host.toLowerCase().split(".")[0];
    if (slug !== "api") {
      const obj = await this.db.franchise.findOne({
        slug,
      });
      req.scope = {
        host: req.headers.host,
        slug: slug,
        franchise: obj,
        location: null,
        isAdmin: slug === "admin",
      };
    } else if (req.headers["sync-public"] && req.headers["sync-private"]) {
      const apiKey = await this.db.postAPIKey.findOne({
        public: req.headers["sync-public"],
        isDeleted: false,
      });
      if (apiKey) {
        const isValidKey = await bcrypt.compare(
          req.headers["sync-private"],
          apiKey.private
        );
        const franchise = await fastify.db.findById(apiKey.franchise);
        const location = await fastify.db.findById(apiKey.location);
        if (isValidKey) {
          req.scope = {
            host: franchise.slug + req.headers.host,
            slug: franchise.slug,
            franchise,
            location,
            isAdmin: false,
          };
        } else {
          reply.code(403).send({ error: "Forbidden action." });
        }
      } else {
        reply.code(403).send({ error: "Forbidden action." });
      }
    } else {
      reply.code(401).send({ error: "Unauthorized user." });
    }
  };
  fastify.addHook("onRequest", getFranchiseScope);
  done();
}

module.exports = fastifyPlugin(franchiseScope);
