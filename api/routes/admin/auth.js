const bcrypt = require("bcrypt");
const { add, getUnixTime, formatDuration } = require("date-fns");
const short = require("short-uuid");

module.exports = async function (fastify, options) {
  fastify.get(
    "/",
    {
      schema: {
        response: {
          200: {
            type: "object",
            properties: {
              account: {
                type: "object",
                properties: {
                  _id: { type: "string" },
                  email: { type: "string" },
                  firstName: { type: "string" },
                  lastName: { type: "string" },
                },
              },
              franchise: {
                type: "object",
                properties: {
                  _id: { type: "string" },
                  name: { type: "string" },
                  slug: { type: "string" },
                  displayTitle: {
                    $ref: "models-franchises#/properties/displayTitle",
                  },
                  documents: {
                    $ref: "models-franchises#/properties/documents",
                  },
                  logo: {
                    $ref: "models-franchises#/properties/logo",
                  },
                  services: {
                    $ref: "models-franchises#/properties/services",
                  },
                },
              },
              token: {
                type: "object",
                properties: {
                  expiresAt: { type: "number" },
                },
              },
            },
          },
        },
      },
    },
    async function (req, reply) {
      if (req.headers.authorization === undefined) {
        reply.code(400).send({ error: "A user must be authenticated." });
        return;
      }
      const sessionId = this.jwt.decode(
        req.headers.authorization.replace("Bearer ", "")
      ).session;
      const session = await this.db.adminSession.findOne({ _id: sessionId });
      if (!session || session.expiresAt < new Date() / 1000) {
        reply.code(400).send({ error: "User session has expired." });
      } else {
        const adminAccount = await this.db.adminAccount.findOne({
          _id: session.account,
        });
        const franchise = await this.db.franchise.findOne({
          _id: session.franchise,
        });
        reply.code(200).send({
          account: adminAccount,
          franchise,
          token: {
            expiresAt: session.expiresAt,
          },
        });
      }
    }
  );

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
          200: {
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
                    $ref: "models-franchises#/properties/displayTitle",
                  },
                  documents: {
                    $ref: "models-franchises#/properties/documents",
                  },
                  logo: {
                    $ref: "models-franchises#/properties/logo",
                  },
                  services: {
                    $ref: "models-franchises#/properties/services",
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

  fastify.post(
    "/temp/",
    {
      preValidation: [fastify.guards.isAdminAuthenticated],
      schema: {
        response: {
          "2xx": {
            type: "object",
            properties: {
              _id: { type: "string" },
              createdAt: { type: "number" },
              expiresAt: { type: "number" },
            },
          },
        },
      },
    },
    async function (req, reply) {
      let code = short.generate().slice(0, 4);
      await fastify.db.adminTempAuthCode.updateMany(
        { account: req.adminAccount._id, franchise: req.scope.franchise._id },
        { isValid: false }
      );
      let adminTempAuthCode = await fastify.db.adminTempAuthCode.create({
        account: req.adminAccount._id,
        franchise: req.scope.franchise._id,
        code: await bcrypt.hash(code, Number(process.env.TEMP_AUTH_SALT)),
        expiresAt: getUnixTime(new Date()) + Number(process.env.TEMP_AUTH_TTL),
      });
      let messageInfo = await fastify.mail.transporter.sendMail({
        from: fastify.mail.fromEmail,
        to: `'${req.adminAccount.fullName} <${req.adminAccount.email}>'`,
        subject: "🔐 PriorityRewards Edit Unlock",
        text: `Your unlock code is the following: ${code}. This code will expire in ${
          Number(process.env.TEMP_AUTH_TTL) / 60
        } minutes.`,
        html: `<p>Your unlock code is the following: <b>${code}</b>.</p>
        <p>This code will expire in ${
          Number(process.env.TEMP_AUTH_TTL) / 60
        } minutes.</p>
        <br />
        <p><i>This email is not monitored. Please direct all support inquiries to support@priorityrewards.com.</i></p>`,
      });
      adminTempAuthCode.messageId = messageInfo.messageId;
      adminTempAuthCode.save();
      reply.code(200).send({
        createdAt: adminTempAuthCode.createdAt,
        expiresAt: adminTempAuthCode.expiresAt,
      });
    }
  );

  fastify.post(
    "/temp/redeem/",
    {
      preValidation: [fastify.guards.isAdminAuthenticated],
      schema: {
        body: {
          type: "object",
          properties: {
            code: { type: "string" },
          },
          required: ["code"],
        },
      },
    },
    async function (req, reply) {
      let adminAuthTempCode = await fastify.db.adminTempAuthCode.findOne({
        account: req.adminAccount._id,
        franchise: req.scope.franchise._id,
        isValid: true,
        isRedeemed: false,
      });
      if (adminAuthTempCode) {
        let isValidCode = await bcrypt.compare(
          req.body.code,
          adminAuthTempCode.code
        );
        if (isValidCode) {
          adminAuthTempCode.isRedeemed = true;
          adminAuthTempCode.isValid = true;
          adminAuthTempCode.save();
          reply.code(200).send();
        } else {
          reply.code(401).send({
            error:
              "A valid temporary code could not be found for this account.",
          });
        }
      } else {
        reply.code(401).send({
          error: "A valid temporary code could not be found for this account.",
        });
      }
      console.log(adminAuthTempCode);
      reply.code(200).send();
    }
  );
};
