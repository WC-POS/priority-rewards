import { FastifyInstance, FastifyPluginOptions, FastifyRequest } from "fastify";
import { GetByIdQueryRoute, RequestWithFile, RouteWithBody } from "../../utils";
import { LocationAttrs, LocationDocument } from "../../models/locations";
import { PaginateOptions, paginate } from "../../utils/paginate";

import { FranchiseAttrs } from "../../models/franchises";
import { POSOptions } from "../../models/pos-api-key";
import { Types } from "mongoose";
import bcrypt from "bcrypt";
import fs from "fs";
import short from "short-uuid";
import { v4 } from "uuid";

export default async function (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  fastify.get(
    "/",
    {
      preValidation: [fastify.guards.isPublic],
      schema: {
        response: {
          200: {
            type: "object",
            properties: {
              _id: { $ref: "Models-Franchise#/properties/_id" },
              slug: { $ref: "Models-Franchise#/properties/slug" },
              displayTitle: {
                $ref: "Models-Franchise#/properties/displayTitle",
              },
              documents: {
                $ref: "Models-Franchise#/properties/documents",
              },
              logo: { $ref: "Models-Franchise#/properties/logo" },
              services: { $ref: "Models-Franchise#/properties/services" },
            },
          },
        },
      },
    },
    async function (req, reply) {
      reply.code(200).send(req.scope.franchise);
    }
  );

  fastify.put<RouteWithBody<FranchiseAttrs>>(
    "/",
    {
      preValidation: [fastify.guards.isAdminAuthenticated],
      schema: {
        body: {
          $ref: "Models-Franchise#",
        },
        response: {
          200: {
            $ref: "Models-Franchise#",
          },
        },
      },
    },
    async function (req, reply) {
      const franchise = await fastify.db.models.Franchise.findOneAndUpdate(
        { _id: req.scope.franchise!._id },
        { $set: req.body },
        { new: true }
      );
      reply.code(200).send(franchise.toJSON());
    }
  );
  fastify.get(
    "/detail/",
    {
      preValidation: [fastify.guards.isAdminAuthenticated],
      schema: {
        response: {
          200: {
            $ref: "Models-Franchise#",
          },
        },
      },
    },
    async function (req, reply) {
      reply.code(200).send(req.scope.franchise);
    }
  );

  fastify.post(
    "/upload/logo/",
    {
      preHandler: fastify.upload.single("logo"),
      preValidation: [fastify.guards.isAdminAuthenticated],
    },
    async function (req: RequestWithFile, reply) {
      if (req.file && req.scope.franchise) {
        try {
          const key = `${req.scope.franchise.slug}/logo/${req.file.filename}`;
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
  fastify.post(
    "/upload/EULA/",
    {
      preHandler: fastify.upload.single("EULA"),
      preValidation: [fastify.guards.isAdminAuthenticated],
    },
    async function (req: RequestWithFile, reply) {
      if (req.file && req.scope.franchise) {
        try {
          const key = `${req.scope.franchise.slug}/EULA/${req.file.filename}`;
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
  fastify.post(
    "/upload/terms/",
    {
      preHandler: fastify.upload.single("terms"),
      preValidation: [fastify.guards.isAdminAuthenticated],
    },
    async function (req: RequestWithFile, reply) {
      if (req.file && req.scope.franchise) {
        try {
          const key = `${req.scope.franchise.slug}/terms/${req.file.filename}`;
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

  fastify.get<GetByIdQueryRoute>(
    "/location/:id/",
    {
      preValidation: [fastify.guards.isAdminAuthenticated],
      schema: {
        response: {
          200: {
            type: "object",
            properties: {
              ...(fastify.getSchema("Models-Location") as any).properties,
              pos: {
                type: "object",
                properties: {
                  _id: { type: "string" },
                  provider: { type: "string", enum: ["FPOS", ""] },
                  private: { type: "string" },
                  public: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
    async (req, reply) => {
      try {
        const location = await fastify.db.models.Location.findById(
          new Types.ObjectId(req.params.id)
        );
        if (location) {
          const apiKey = await fastify.db.models.POSAPIKey.findOne({
            location: location._id,
            isDeleted: false,
          });
          reply.code(200).send({
            ...location.toJSON(),
            pos: apiKey
              ? {
                  ...apiKey.toJSON(),
                  private: "superPrivateSuperDuperHiddenKey",
                }
              : { _id: null, provider: "", private: "", public: "" },
          });
        } else {
          reply.code(404).send({ error: "Location not found." });
        }
      } catch (err) {
        reply.code(500).send({ error: err });
      }
    }
  );
  fastify.put<GetByIdQueryRoute & RouteWithBody<LocationAttrs>>(
    "/location/:id/",
    {
      preValidation: [fastify.guards.isAdminAuthenticated],
      schema: {
        body: {
          $ref: "Models-Location#",
        },
        response: {
          200: {
            $ref: "Models-Location#",
          },
        },
      },
    },
    async function (req, reply) {
      try {
        const location = await fastify.db.models.Location.findOneAndUpdate(
          { _id: req.params.id },
          { $set: req.body as LocationAttrs },
          { new: true }
        );
        reply.code(200).send(location.toJSON());
      } catch (err) {
        console.log(err);
        reply.code(400).send({ error: err });
      }
    }
  );
  fastify.post<
    GetByIdQueryRoute &
      RouteWithBody<{
        provider: POSOptions;
      }>
  >(
    "/location/:id/generate/apiKey/",
    {
      preValidation: [fastify.guards.isAdminAuthenticated],
      schema: {
        body: {
          type: "object",
          properties: {
            provider: { $ref: "Models-POSAPIKey#/properties/provider" },
          },
        },
        response: {
          200: {
            $ref: "Models-POSAPIKey#",
          },
        },
      },
    },
    async function (req, reply) {
      if (req.body.provider && req.scope.franchise) {
        const location = await fastify.db.models.Location.findById(
          req.params.id
        );
        if (location) {
          await fastify.db.models.POSAPIKey.updateMany(
            { franchise: req.scope.franchise._id, location: location._id },
            { $set: { isDeleted: true } }
          );
          const publicKey = short().fromUUID(v4());
          const privateKey = short().fromUUID(v4());
          const privateHash = await bcrypt.hash(
            privateKey,
            Number(process.env.SALT_ROUNDS)
          );
          const apiKey = await fastify.db.models.POSAPIKey.create({
            franchise: req.scope.franchise._id,
            location: location._id,
            provider: req.body.provider,
            public: publicKey,
            private: privateHash,
          });
          reply.code(200).send({ ...apiKey.toJSON(), private: privateKey });
        } else {
          reply.code(404).send({ error: "Location could not be found." });
        }
      } else {
        reply.code(400).send({ error: "Provider is required." });
      }
    }
  );
  fastify.post<GetByIdQueryRoute>(
    "/location/:id/upload/previewImage/",
    {
      preHandler: fastify.upload.single("previewImage"),
      preValidation: [fastify.guards.isAdminAuthenticated],
    },
    async function (req: RequestWithFile<GetByIdQueryRoute>, reply) {
      let isValidLocation = false;
      try {
        isValidLocation = Boolean(
          await fastify.db.models.Location.findById(
            new Types.ObjectId(req.params.id)
          ).count()
        );
      } catch (err) {
        console.log(err);
      }
      if (req.file && isValidLocation && req.scope.franchise) {
        try {
          const key = `${req.scope.franchise.slug}/locations/${req.params.id}/previewImage/${req.file.filename}`;
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
  fastify.get<RouteWithBody<PaginateOptions>>(
    "/locations/",
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
                  $ref: "Models-Location#",
                },
              },
            },
          },
        },
      },
    },
    async function (req, reply) {
      try {
        const body = await paginate<LocationDocument>(
          fastify.db.models.Location.find({
            franchise: req.scope.franchise!._id,
          }).sort({ name: 1 }),
          {
            page: req.body && req.body.page ? req.body.page : 1,
            size:
              req.body && req.body.size
                ? req.body.size
                : parseInt(process.env.PAGE_SIZE),
          }
        );
        reply.code(200).send(body);
      } catch (err) {
        console.log(err);
        reply.code(500).send({ error: err });
      }
    }
  );
  fastify.post<RouteWithBody<LocationAttrs>>(
    "/locations/",
    {
      preValidation: [fastify.guards.isAdminAuthenticated],
      schema: {
        body: {
          $ref: "Models-Location#",
        },
        response: {
          201: {
            $ref: "Models-Location#",
          },
        },
      },
    },
    async function (req, reply) {
      try {
        let location = await fastify.db.models.Location.create({
          ...req.body,
          franchise: req.scope.franchise!._id,
        });
        reply.code(201).send(location.toJSON());
      } catch (err) {
        console.log(err);
        reply.code(400).send({ error: err });
      }
    }
  );
}
