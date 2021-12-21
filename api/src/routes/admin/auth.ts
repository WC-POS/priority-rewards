import {
  AdminAccountAttrs,
  AdminAccountDocument,
} from "../../models/admin-accounts";
import { AdminSessionJWT, RouteWithBody, RouteWithParams } from "../../utils";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { PaginateOptions, paginate } from "../../utils/paginate";
import { add, getUnixTime } from "date-fns";

import { FastifyPluginOptions } from "fastify";
import { RouteGenericInterface } from "fastify/types/route";
import bcrypt from "bcrypt";
import short from "short-uuid";

export default async function (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
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
                    $ref: "Models-Franchise#/properties/displayTitle",
                  },
                  documents: {
                    $ref: "Models-Franchise#/properties/documents",
                  },
                  logo: {
                    $ref: "Models-Franchise#/properties/logo",
                  },
                  services: {
                    $ref: "Models-Franchise#/properties/services",
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
    async function (req: FastifyRequest, reply: FastifyReply) {
      if (req.headers.authorization === undefined) {
        reply.code(400).send({ error: "A user must be authenticated." });
        return;
      }
      const sessionId = this.jwt.decode<AdminSessionJWT>(
        req.headers.authorization.replace("Bearer ", "")
      )!.session;
      const session = await this.db.models.AdminSession.findOne({
        _id: sessionId,
      });
      if (!session || session.isExpired) {
        reply.code(400).send({ error: "User session has expired." });
      } else {
        const adminAccount = await this.db.models.AdminAccount.findOne({
          _id: session.account,
        });
        const franchise = await this.db.models.Franchise.findOne({
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

  fastify.get<RouteWithParams<{ id: string }>>(
    "/account/:id/",
    {
      preValidation: [fastify.guards.isAdminAuthenticated],
      schema: {
        response: {
          200: {
            type: "object",
            properties: {
              _id: { type: "string" },
              firstName: { type: "string" },
              lastName: { type: "string" },
              email: { type: "string" },
            },
          },
        },
      },
    },
    async function (req, reply) {
      const account = await fastify.db.models.AdminAccount.findById(
        req.params.id
      );
      if (account) {
        reply.code(200).send(account);
      } else {
        reply
          .code(404)
          .send({ error: "This admin account could not be found." });
      }
    }
  );

  fastify.put<
    RouteWithBody<{
      firstName: string;
      lastName: string;
    }> &
      RouteWithParams<{ id: string }>
  >(
    "/account/:id/",
    {
      preValidation: [fastify.guards.isAdminAuthenticated],
      schema: {
        body: {
          firstName: { type: "string" },
          lastName: { type: "string" },
        },
        response: {
          200: {
            firstName: { type: "string" },
            lastName: { type: "string" },
            email: { type: "string" },
            _id: { type: "string" },
          },
        },
      },
    },
    async function (req, reply) {
      const account = await fastify.db.models.AdminAccount.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (account) {
        reply.code(200).send(account.toJSON());
      } else {
        reply
          .code(404)
          .send({ error: "This admin account could not be found." });
      }
    }
  );

  fastify.delete<RouteWithParams<{ id: string }>>(
    "/account/:id/",
    {
      preValidation: [fastify.guards.isAdminAuthenticated],
      schema: {
        response: {
          200: {
            _id: { type: "string" },
            firstName: { type: "string" },
            lastName: { type: "string" },
            email: { type: "string" },
          },
        },
      },
    },
    async function (req, reply) {
      const account = await fastify.db.models.AdminAccount.findByIdAndDelete(
        req.params.id
      );
      if (account) {
        reply.code(200).send(account);
      } else {
        reply.code(404).send({ error: "This admin account not be found." });
      }
    }
  );

  fastify.get<RouteWithBody<PaginateOptions>>(
    "/accounts/",
    {
      preValidation: [fastify.guards.isAdminAuthenticated],
      schema: {
        body: {
          $ref: "list-page-body#",
        },
        response: {
          200: {
            type: "object",
            properties: {
              ...require("../../schema/list-page-response").properties,
              results: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    email: { type: "string" },
                    lastName: { type: "string" },
                    firstName: { type: "string" },
                    _id: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    async function (req, reply) {
      try {
        reply.code(200).send(
          await paginate<AdminAccountDocument>(
            fastify.db.models.AdminAccount.find(
              {
                franchise: req.scope.franchise!._id,
              },
              { password: 0 }
            ).sort({ lastName: 1, firstName: 1, email: 1 }),
            req.body || {}
          )
        );
      } catch (err) {
        reply.code(500).send({ error: err });
      }
    }
  );

  fastify.post<RouteWithBody<AdminAccountAttrs>>(
    "/accounts/",
    {
      preValidation: [fastify.guards.isAdminAuthenticated],
      schema: {
        body: {
          $ref: "Models-AdminAccount#",
        },
        response: {
          201: {
            $ref: "Models-AdminAccount#",
          },
        },
      },
    },
    async function (req, reply) {
      try {
        let registerCode;
        let password = req.body.password;
        if (password) {
          password = await bcrypt.hash(
            password,
            parseInt(process.env.SALT_ROUNDS)
          );
        } else {
          const translator = short(short.constants.flickrBase58, {
            consistentLength: false,
          });
          password = await bcrypt.hash(
            translator.new(),
            parseInt(process.env.SALT_ROUNDS)
          );
          registerCode = short.generate().slice(0, 8);
        }
        const account = await fastify.db.models.AdminAccount.create({
          ...req.body,
          password,
          franchise: req.scope.franchise!._id,
        });
        if (registerCode) {
          const adminAccountRegistrationCode =
            await fastify.db.models.AdminAccountRegistrationCode.create({
              account: account._id,
              franchise: account.franchise,
              code: await bcrypt.hash(
                registerCode,
                parseInt(process.env.TEMP_AUTH_SALT)
              ),
              expiresAt: getUnixTime(add(new Date(), { days: 2 })),
            });
          let messageInfo = await fastify.mail.utils.sendNewAdminAccountEmail(
            adminAccountRegistrationCode,
            registerCode,
            { days: 2 }
          );
          if (messageInfo) {
            adminAccountRegistrationCode.messageId = messageInfo.messageId;
            adminAccountRegistrationCode.save();
          }
          reply.code(200).send({ ...account.toJSON(), password: undefined });
        } else {
          reply.code(200).send({ ...account.toJSON(), password: undefined });
        }
      } catch (err) {
        reply.code(400).send({ error: err });
      }
    }
  );

  fastify.post(
    "/signin/",
    {
      preValidation: [fastify.guards.isPublic],
      schema: {
        // tags: ["auth", "admin"],
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
                    $ref: "Models-Franchise#/properties/displayTitle",
                  },
                  documents: {
                    $ref: "Models-Franchise#/properties/documents",
                  },
                  logo: {
                    $ref: "Models-Franchise#/properties/logo",
                  },
                  services: {
                    $ref: "Models-Franchise#/properties/services",
                  },
                },
              },
            },
          },
        },
      },
    },
    async function (
      req: FastifyRequest<
        RouteGenericInterface & {
          Body: {
            email: string;
            password: string;
          };
        }
      >,
      reply
    ) {
      let adminAccount = null;
      if (req.scope.franchise !== null) {
        adminAccount = await this.db.models.AdminAccount.findOne({
          email: req.body.email.trim().toLowerCase(),
          franchise: req.scope.franchise!._id,
        }).exec();
      } else {
        adminAccount = await this.db.models.AdminAccount.findOne({
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
          const session = await this.db.models.AdminSession.create({
            account: adminAccount._id,
            franchise: req.scope.franchise,
            createdAt: getUnixTime(new Date()),
            expiresAt: getUnixTime(
              add(new Date(), { seconds: parseInt(process.env.JWT_TTL) })
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
      await fastify.db.models.AdminTempAuthCode.updateMany(
        { account: req.adminAccount!._id, franchise: req.scope.franchise!._id },
        { isValid: false }
      );
      let adminTempAuthCode = await fastify.db.models.AdminTempAuthCode.create({
        account: req.adminAccount!._id,
        franchise: req.scope.franchise!._id,
        code: await bcrypt.hash(code, parseInt(process.env.TEMP_AUTH_SALT)),
        expiresAt:
          getUnixTime(new Date()) + parseInt(process.env.TEMP_AUTH_TTL),
      });
      let messageInfo = await fastify.mail.transporter.sendMail({
        from: fastify.mail.fromEmail,
        to: `'${req.adminAccount!.fullname} <${req.adminAccount!.email}>'`,
        subject: "🔐 PriorityRewards Edit Unlock",
        text: `Your unlock code is the following: ${code}. This code will expire in ${
          parseInt(process.env.TEMP_AUTH_TTL) / 60
        } minutes.`,
        html: `<p>Your unlock code is the following: <b>${code}</b>.</p>
        <p>This code will expire in ${
          parseInt(process.env.TEMP_AUTH_TTL) / 60
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
    async function (
      req: FastifyRequest<RouteGenericInterface & { Body: { code: string } }>,
      reply
    ) {
      let adminAuthTempCode = await fastify.db.models.AdminTempAuthCode.findOne(
        {
          account: req.adminAccount!._id,
          franchise: req.scope.franchise!._id,
          isValid: true,
          isRedeemed: false,
        }
      );
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

  fastify.post<RouteWithBody<{ email: string }>>(
    "/forgot/",
    {
      preValidation: [fastify.guards.isPublic],
      schema: {
        body: {
          type: "object",
          required: ["email"],
          properties: {
            email: { type: "string" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              email: { type: "string" },
              expiresAt: { type: "number" },
            },
          },
        },
      },
    },
    async function (req, reply) {
      const account = await fastify.db.models.AdminAccount.findOne({
        email: req.body.email.toLowerCase().trim(),
        franchise: req.scope.franchise,
      });
      if (account && req.scope.franchise) {
        await fastify.db.models.ForgotPasswordCode.updateMany(
          { account: account._id, franchise: req.scope.franchise._id },
          { isValid: false }
        );
        const simpleCode = short.generate().slice(0, 8);
        const forgotPasswordCode =
          await fastify.db.models.ForgotPasswordCode.create({
            account: account._id,
            franchise: req.scope.franchise._id,
            code: await bcrypt.hash(
              simpleCode,
              parseInt(process.env.TEMP_AUTH_SALT)
            ),
            expiresAt: getUnixTime(add(new Date(), { hours: 1 })),
          });
        const messageInfo =
          await fastify.mail.utils.sendForgotAdminPasswordEmail(
            forgotPasswordCode,
            simpleCode,
            { hours: 1 }
          );
        if (messageInfo) {
          forgotPasswordCode.messageId = messageInfo.messageId;
          forgotPasswordCode.save();
          reply.code(200).send({
            email: account.email,
            expiresAt: forgotPasswordCode.expiresAt,
          });
        } else {
          reply
            .code(500)
            .send({ error: "Forgot password email could not be sent." });
        }
      } else {
        reply.code(404).send({
          error: "An admin account with that email address could not be found.",
        });
      }
    }
  );

  fastify.post<RouteWithBody<{ email: string; code: string }>>(
    "/forgot/redeem/",
    {
      preValidation: [fastify.guards.isPublic],
      schema: {
        body: {
          type: "object",
          required: ["email", "code"],
          properties: {
            email: { type: "string" },
            code: { type: "string" },
          },
        },
        response: {
          200: {
            email: { type: "string" },
            codeId: { type: "string" },
          },
        },
      },
    },
    async function (req, reply) {
      const account = await fastify.db.models.AdminAccount.findOne({
        email: req.body.email.trim().toLowerCase(),
        franchise: req.scope.franchise,
      });
      if (account) {
        const forgotPasswordCode =
          await fastify.db.models.ForgotPasswordCode.findOne({
            account,
            franchise: req.scope.franchise,
            expiresAt: { $gt: getUnixTime(new Date()) },
            isValid: true,
          });
        if (forgotPasswordCode) {
          const isValid = await bcrypt.compare(
            req.body.code,
            forgotPasswordCode.code
          );
          if (isValid) {
            forgotPasswordCode.isRedeemed = true;
            forgotPasswordCode.save();
            reply
              .code(200)
              .send({ codeId: forgotPasswordCode._id, email: account.email });
          } else {
            reply.code(400).send({ error: "The code provided was not valid." });
          }
        } else {
          reply.code(404).send({
            error:
              "A forgot password request for this admin account could not be found.",
          });
        }
      } else {
        reply.code(404).send({
          error: "An admin account with that email address could not be found.",
        });
      }
    }
  );

  fastify.get<RouteWithParams<{ id: string }>>(
    "/forgot/check/:id",
    {
      preValidation: [fastify.guards.isPublic],
      schema: {
        querystring: {
          id: { type: "string" },
        },
        response: {
          200: {
            email: { type: "string" },
            isValid: { type: "boolean" },
          },
        },
      },
    },
    async function (req, reply) {
      const forgotPasswordCode =
        await fastify.db.models.ForgotPasswordCode.findById(req.params.id);
      if (forgotPasswordCode) {
        const account = await fastify.db.models.AdminAccount.findById(
          forgotPasswordCode.account
        );
        if (
          account &&
          forgotPasswordCode.isRedeemed &&
          forgotPasswordCode.isValid &&
          !forgotPasswordCode.changedPassword &&
          forgotPasswordCode.expiresAt > getUnixTime(new Date())
        ) {
          reply.code(200).send({ email: account.email, isValid: true });
        } else {
          reply
            .code(400)
            .send({ email: account ? account.email : "", isValid: false });
        }
      } else {
        reply.code(400).send({ email: "", isValid: false });
      }
    }
  );

  fastify.post<
    RouteWithBody<{ code: string; password: string; confirm: string }>
  >(
    "/forgot/change/",
    {
      preValidation: [fastify.guards.isPublic],
      schema: {
        body: {
          code: { type: "string" },
          password: { type: "string" },
          confirm: { type: "string" },
        },
        response: {
          200: {
            email: { type: "string" },
          },
        },
      },
    },
    async function (req, reply) {
      const forgotPasswordCode =
        await fastify.db.models.ForgotPasswordCode.findById(req.body.code);
      if (forgotPasswordCode) {
        const account = await fastify.db.models.AdminAccount.findById(
          forgotPasswordCode.account
        );
        if (account && forgotPasswordCode.isRedeemed) {
          if (forgotPasswordCode.expiresAt < getUnixTime(new Date())) {
            reply
              .code(400)
              .send({ error: "Forgot password code has expired." });
          } else if (req.body.password !== req.body.confirm) {
            reply.code(400).send({ error: "Passwords do not match." });
          } else if (
            !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(
              req.body.password.trim()
            )
          ) {
            reply.code(400).send({
              error:
                "Password is not secure enough. New Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number. The new password must also be at least 8 characters long.",
            });
          } else {
            const isOldPassword = await bcrypt.compare(
              req.body.password,
              account.password
            );
            if (isOldPassword) {
              reply.code(400).send({
                error: "New password cannot be the same as your old password.",
              });
            } else {
              forgotPasswordCode.changedPassword = true;
              forgotPasswordCode.isValid = false;
              forgotPasswordCode.save();
              account.password = await bcrypt.hash(
                req.body.password.trim(),
                parseInt(process.env.SALT_ROUNDS, 10)
              );
              account.save();
              reply.code(200).send({ email: account.email });
            }
          }
        } else {
          reply
            .code(404)
            .send({ error: "The change password request could not be found." });
        }
      } else {
        reply.code(404).send({
          error: "The change password request could not be found.",
        });
      }
    }
  );
}
