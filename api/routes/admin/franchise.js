const fs = require("fs");
const { Types } = require("mongoose");

module.exports = async function (fastify, options) {
  fastify.get(
    "/",
    {
      schema: {
        response: {
          200: {
            type: "object",
            properties: {
              _id: { $ref: "models-franchises#/properties/_id" },
              slug: { $ref: "models-franchises#/properties/slug" },
              displayTitle: {
                $ref: "models-franchises#/properties/displayTitle",
              },
              documents: {
                $ref: "models-franchises#/properties/documents",
              },
              logo: { $ref: "models-franchises#/properties/logo" },
              services: { $ref: "models-franchises#/properties/services" },
            },
          },
        },
      },
    },
    async function (req, reply) {
      reply.code(200).send(req.scope.franchise);
    }
  );
  fastify.put(
    "/",
    {
      preValidation: [fastify.guards.isAdminAuthenticated],
      schema: {
        body: {
          $ref: "models-franchises#",
        },
        response: {
          200: {
            $ref: "models-franchises#",
          },
        },
      },
    },
    async function (req, reply) {
      const franchise = await fastify.db.franchise.findOneAndUpdate(
        { _id: req.scope.franchise._id },
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
            $ref: "models-franchises#",
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
    async function (req, reply) {
      if (req.file) {
        try {
          const key = `${req.scope.franchise.slug}/logo/${req.file.filename}`;
          await fastify.s3.putObject({
            Bucket: process.env.AWS_BUCKET,
            Key: key,
            Body: fs.createReadStream(req.file.path),
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
      console.log(res);
      reply.code(200).send({ name: req.file.filename });
    }
  );
  fastify.post(
    "/upload/EULA/",
    {
      preHandler: fastify.upload.single("EULA"),
      preValidation: [fastify.guards.isAdminAuthenticated],
    },
    async function (req, reply) {
      if (req.file) {
        try {
          const key = `${req.scope.franchise.slug}/EULA/${req.file.filename}`;
          await fastify.s3.putObject({
            Bucket: process.env.AWS_BUCKET,
            Key: key,
            Body: fs.createReadStream(req.file.path),
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
      console.log(res);
      reply.code(200).send({ name: req.file.filename });
    }
  );
  fastify.post(
    "/upload/terms/",
    {
      preHandler: fastify.upload.single("terms"),
      preValidation: [fastify.guards.isAdminAuthenticated],
    },
    async function (req, reply) {
      if (req.file) {
        try {
          const key = `${req.scope.franchise.slug}/terms/${req.file.filename}`;
          await fastify.s3.putObject({
            Bucket: process.env.AWS_BUCKET,
            Key: key,
            Body: fs.createReadStream(req.file.path),
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
      console.log(res);
      reply.code(200).send({ name: req.file.filename });
    }
  );
  fastify.get(
    "/location/:id/",
    {
      preValidation: [fastify.guards.isAdminAuthenticated],
      schema: {
        repsonse: {
          200: {
            $ref: "models-locations#",
          },
        },
      },
    },
    async function (req, reply) {
      try {
        const location = await fastify.db.location.findById(
          Types.ObjectId(req.params.id)
        );
        if (location) {
          reply.code(200).send(location.toJSON());
        } else {
          reply.code(404).send({ error: "Location not found." });
        }
      } catch (err) {
        reply.code(500).send({ error: err });
      }
    }
  );
  fastify.put(
    "/location/:id/",
    {
      preValidation: [fastify.guards.isAdminAuthenticated],
      schema: {
        body: {
          $ref: "models-locations#",
        },
        repsonse: {
          200: {
            $ref: "models-locations#",
          },
        },
      },
    },
    async function (req, reply) {
      try {
        const location = await fastify.db.location.findOneAndUpdate(
          { _id: req.params.id },
          { $set: req.body },
          { new: true }
        );
        reply.code(200).send(location.toJSON());
      } catch (err) {
        console.log(err);
        reply.code(400).send({ error: err });
      }
    }
  );
  fastify.post(
    "/location/:id/upload/previewImage/",
    {
      preHandler: fastify.upload.single("previewImage"),
      preValidation: [fastify.guards.isAdminAuthenticated],
    },
    async function (req, reply) {
      let isValidLocation = false;
      try {
        isValidLocation = Boolean(
          await fastify.db.location
            .findById(Types.ObjectId(req.params.id))
            .count()
        );
      } catch (err) {
        console.log(err);
      }
      if (req.file && isValidLocation) {
        try {
          const key = `${req.scope.franchise.slug}/locations/${req.params.id}/previewImage/${req.file.filename}`;
          await fastify.s3.putObject({
            Bucket: process.env.AWS_BUCKET,
            Key: key,
            Body: fs.createReadStream(req.file.path),
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
    "/locations/",
    {
      preValidation: [fastify.guards.isAdminAuthenticated],
      schema: {
        body: {
          type: ["object", "null"],
          page: { type: "number" },
          pageSize: { type: "number" },
        },
        response: {
          200: {
            type: "object",
            properties: {
              count: { type: "number" },
              page: { type: "number" },
              maxPage: { type: "number" },
              results: {
                type: "array",
                items: {
                  type: "object",
                  $ref: "models-locations#",
                },
              },
            },
          },
        },
      },
    },
    async function (req, reply) {
      const pageSize =
        req.body && req.body.pageSize
          ? req.body.pageSize
          : process.env.PAGE_SIZE;
      const page = req.body && req.body.page ? req.body.page : 1;
      const list = await fastify.db.location
        .find({ franchise: req.scope.franchise._id })
        .sort({ name: 1 })
        .skip(pageSize * (page - 1))
        .limit(pageSize);
      const queryCount = await fastify.db.location
        .find({ franchise: req.scope.franchise._id })
        .count();
      reply.code(200).send({
        count: queryCount,
        page,
        maxPage: Math.ceil(queryCount / pageSize),
        results: list,
      });
    }
  );
  fastify.post(
    "/locations/",
    {
      preValidation: [fastify.guards.isAdminAuthenticated],
      schema: {
        body: {
          $ref: "models-locations#",
        },
        response: {
          201: {
            $ref: "models-locations#",
          },
        },
      },
    },
    async function (req, reply) {
      try {
        let location = await fastify.db.location.create({
          ...req.body,
          franchise: req.scope.franchise._id,
        });
        reply.code(201).send(location.toJSON());
      } catch (err) {
        console.log(err);
        reply.code(400).send({ error: err });
      }
    }
  );
};
