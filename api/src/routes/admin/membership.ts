import fs from "fs";

import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { paginate, PaginateOptions } from "../../utils/paginate";
import { UserAttrs, UserDocument } from "../../models/users";
import { GetByIdQueryRoute, RequestWithFile, RouteWithBody } from "../../utils";
import { ClubAttrs } from "../../models/clubs";

export default async function (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  fastify.get<RouteWithBody<PaginateOptions>>(
    "/customers/",
    {
      preValidation: [fastify.guards.isAdminAuthenticated],
      schema: {
        body: {
          $ref: "list-page-body#",
        },
        response: {
          200: {
            $ref: "list-page-response#",
            properties: {
              results: {
                type: "array",
                items: {
                  ref: "Models-User#",
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
          await paginate<UserDocument>(
            fastify.db.models.User.find({
              franchise: req.scope.franchise!._id,
            }).sort({ lastName: 1, firstName: 1, email: 1, phone: 1 }),
            req.body ? req.body : {}
          )
        );
      } catch (err) {
        console.log(err);
        reply.code(500).send({ error: err });
      }
    }
  );
  fastify.post<RouteWithBody<UserAttrs>>(
    "/customers/",
    {
      preValidation: [fastify.guards.isAdminAuthenticated],
      schema: {
        body: {
          $ref: "Models-User#",
        },
        response: {
          200: {
            $ref: "Models-User#",
          },
        },
      },
    },
    async function (req, reply) {
      try {
        const user = await fastify.db.models.User.create({
          ...req.body,
          franchise: req.scope.franchise!._id,
        });
        reply.code(201).send(user);
      } catch (err) {
        console.log(err);
        reply.code(400).send({ error: err });
      }
    }
  );
  fastify.get<RouteWithBody<UserAttrs> & GetByIdQueryRoute>(
    "/customer/:id/",
    {
      preValidation: [fastify.guards.isAdminAuthenticated],
      schema: {
        response: {
          200: {
            $ref: "Models-User#",
          },
        },
      },
    },
    async function (req, reply) {
      try {
        const user = await fastify.db.models.User.findOneAndUpdate(
          { _id: req.params.id },
          { $set: req.body },
          { new: true }
        );
        reply.code(200).send(user.toJSON());
      } catch (err) {
        console.log(err);
        reply.code(400).send({ error: err });
      }
    }
  );
  fastify.post(
    "/customer/upload/avatar/",
    {
      preHandler: fastify.upload.single("avatar"),
      preValidation: [fastify.guards.isAdminAuthenticated],
    },
    async function (req: RequestWithFile, reply) {
      if (req.file) {
        try {
          const key = `${req.scope.franchise!.slug}/customers/avatars/${
            req.file.filename
          }`;
          await fastify.s3.putObject({
            Bucket: process.env.AWS_BUCKET,
            Key: key,
            Body: fs.createReadStream(req.file.path!),
            ACL: "public-read",
          });
          const location = `https://${
            process.env.AWS_BUCKET
          }.${process.env.AWS_ENDPOINT.replace("https://", "")}/${key}`;
          reply.code(200).send({ location });
        } catch (err) {
          console.log(err);
          reply.code(500).send({ error: err });
        }
      } else {
        reply
          .code(400)
          .send({ error: "Please include a file in your upload." });
      }
    }
  );
  fastify.get(
    "/clubs/",
    {
      preValidation: [fastify.guards.isAdminAuthenticated],
      schema: {
        response: {
          200: {
            type: "array",
            items: {
              $ref: "Models-Club#",
            },
          },
        },
      },
    },
    async function (req, reply) {
      const clubs = await fastify.db.models.Club.find({
        franchise: req.scope.franchise!._id,
      }).sort({
        isEntryClub: 1,
        name: 1,
      });
      reply.code(200).send(clubs);
    }
  );
  fastify.post<RouteWithBody<ClubAttrs>>(
    "/clubs/",
    {
      preValidation: [fastify.guards.isAdminAuthenticated],
      schema: {
        body: {
          $ref: "Models-Club#",
        },
        response: {
          201: {
            $ref: "Models-Club#",
          },
        },
      },
    },
    async function (req, reply) {
      try {
        let club = await fastify.db.models.Club.create({
          ...req.body,
          franchise: req.scope.franchise!._id,
        });
        if (club.isEntryClub) {
          await fastify.db.models.Club.updateMany(
            { _id: { $ne: club._id } },
            { $set: { isEntryClub: false } }
          );
        }
        reply.code(201).send(club.toJSON());
      } catch (err) {
        console.log(err);
        reply.code(400).send({ error: err });
      }
    }
  );

  fastify.put<RouteWithBody<ClubAttrs> & GetByIdQueryRoute>(
    "/club/:id/",
    {
      preValidation: [fastify.guards.isAdminAuthenticated],
      schema: {
        body: {
          $ref: "Models-Club#",
        },
        response: {
          200: {
            $ref: "Models-Club#",
          },
        },
      },
    },
    async function (req, reply) {
      try {
        const club = await fastify.db.models.Club.findOneAndUpdate(
          { _id: req.params.id },
          { $set: req.body },
          { new: true }
        );
        reply.code(200).send(club.toJSON());
      } catch (err) {
        console.log(err);
        reply.code(400).send({ error: err });
      }
    }
  );
}
