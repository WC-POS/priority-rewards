const fastifyPlugin = require("fastify-plugin");

function franchiseScope(fastify, opts, done) {
  const getFranchiseScope = async function (req, reply) {
    const slug = req.headers.host.toLowerCase().split(".")[0];
    const obj = await this.db.franchise.findOne({
      slug,
    });
    req.scope = {
      host: req.headers.host,
      slug: slug,
      franchise: obj,
      isAdmin: slug === "admin",
    };
  };
  fastify.addHook("onRequest", getFranchiseScope);
  done();
}

module.exports = fastifyPlugin(franchiseScope);
