const bcrypt = require("bcrypt");
const { getUnixTime } = require("date-fns");
const fastifyPlugin = require("fastify-plugin");

async function adminAuthentication(fastify, opts, done) {
  const accessDeniedBody = {
    error: "Access denied. Please login to continue.",
  };

  const getStandardScope = function (req) {
    const slug = req.headers.host.toLowerCase().split(".")[0];
    return {
      host: req.headers.host,
      slug,
      isAdmin: slug === "admin",
      isApi: slug === "api",
    };
  };

  const isAdminAuthenticated = async function (req, reply) {
    try {
      let token;
      if (req.headers.authorization) {
        token = await fastify.jwt.decode(
          req.headers.authorization.replace("Bearer ", "")
        );
        const adminSession = await fastify.db.adminSession.findOne({
          _id: token.session,
          expiresAt: { $gt: getUnixTime(new Date()) },
        });
        if (adminSession) {
          const adminAccount = await fastify.db.adminAccount.findOne({
            _id: adminSession.account,
            franchise: adminSession.franchise,
          });
          const franchise = await fastify.db.franchise.findById(
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

  const isAPIAuthenticated = async function (req, reply) {
    try {
      if (req.headers["sync-public"] && req.headers["sync-private"]) {
        const apiKey = await fastify.db.posAPIKey.findOne({
          public: req.headers["sync-public"],
          isDeleted: false,
        });
        if (apiKey) {
          const isValidKey = await bcrypt.compare(
            req.headers["sync-private"],
            apiKey.private
          );
          if (isValidKey) {
            const franchise = await fastify.db.franchise.findById(
              apiKey.franchise
            );
            const location = await fastify.db.location.findById(
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
  });
  done();
}

module.exports = fastifyPlugin(adminAuthentication);
