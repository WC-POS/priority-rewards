const fs = require("fs");

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
        { $set: req.body }
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
};
