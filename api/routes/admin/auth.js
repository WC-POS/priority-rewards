const bcrypt = require("bcrypt");
const { add, getUnixTime } = require("date-fns");

module.exports = async function (fastify, options) {
  fastify.post(
    "/signin/",
    {
      schema: {
        tags: ["auth", "admin"],
        body: {
          type: "object",
          properties: {
            email: { type: "string" },
            password: { type: "string" },
          },
          required: ["email", "password"],
        },
        response: {
          "2xx": {
            type: "object",
            properties: {
              _id: { type: "string" },
              email: { type: "string" },
              firstName: { type: "string" },
              lastName: { type: "string" },
              token: {
                type: "object",
                properties: {
                  key: { type: "string" },
                  expiresAt: { type: "number" },
                },
              },
              franchise: {
                type: ["object", "null"],
                properties: {
                  _id: { type: "string" },
                  name: { type: "string" },
                  slug: { type: "string" },
                  displayTitle: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      superTitle: { type: "string" },
                      subtitle: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    async function (req, reply) {
      let adminAccount = null;
      if (req.scope.franchise !== null) {
        adminAccount = await this.db.adminAccount
          .findOne({
            email: req.body.email.trim().toLowerCase(),
            franchise: req.scope.franchise._id,
          })
          .exec();
      } else {
        adminAccount = await this.db.adminAccount.findOne({
          email: req.body.email,
          franchise: null,
        });
      }
      if (adminAccount) {
        const isValidPassword = await bcrypt.compare(
          req.body.password,
          adminAccount.password
        );
        if (isValidPassword) {
          const session = await this.db.adminSession.create({
            account: adminAccount._id,
            franchise: req.scope.franchise,
            createdAt: getUnixTime(new Date()),
            expiresAt: getUnixTime(
              add(new Date(), { seconds: process.env.JWT_TTL })
            ),
          });
          const key = this.jwt.sign(
            { session: session._id },
            { expiresIn: process.env.JWT_TTL }
          );
          console.log(key);
          reply.code(200).send({
            ...adminAccount.toJSON(),
            token: {
              key,
              expiresAt: session.expiresAt,
            },
            franchise: req.scope.franchise
              ? req.scope.franchise.toJSON()
              : null,
          });
        } else {
          reply.code(401).send({
            error: "A user with that email and password could not be found.",
          });
        }
      } else {
        reply.code(401).send({
          error: "A user with that email and password could not be found.",
        });
      }
    }
  );
};
