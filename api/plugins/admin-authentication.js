const { getUnixTime } = require("date-fns");
const fastifyPlugin = require("fastify-plugin");

async function adminAuthentication(fastify, opts, done) {
  const accessDeniedBody = {
    error: "Access denied. Please login to continue.",
  };

  const isAdminAuthenticated = async function (req, reply) {
    try {
      let token;
      if (req.headers.authorization) {
        token = await fastify.jwt.decode(
          req.headers.authorization.replace("Bearer ", "")
        );
        let adminSession = await fastify.db.adminSession.findOne({
          _id: token.session,
          expiresAt: { $gt: getUnixTime(new Date()) },
        });
        if (adminSession) {
          let adminAccount = await fastify.db.adminAccount.findOne({
            _id: adminSession.account,
            franchise: req.scope.franchise._id,
          });
          if (adminAccount) {
            req.adminSession = adminSession;
            req.adminAccount = adminAccount;
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
    }
  };
  fastify.decorate("guards", {
    isAdminAuthenticated,
  });
  done();
}

module.exports = fastifyPlugin(adminAuthentication);
