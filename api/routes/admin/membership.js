const fs = require("fs");
const { Types } = require("mongoose");

module.exports = async function (fastify, options) {
  fastify.get(
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
                  ref: "models-users#",
                },
              },
            },
          },
        },
      },
    },
    async function (req, reply) {
      try {
        reply
          .code(200)
          .send(
            await fastify.paginate(
              fastify.db.user
                .find({ franchise: req.scope.franchise._id })
                .sort({ lastName: 1, firstName: 1, email: 1, phone: 1 }),
              req.body ? req.body : {}
            )
          );
      } catch (err) {
        console.log(err);
        reply.code(500).send({ error: err });
      }
    }
  );
  fastify.post(
    "/customers/",
    {
      preValidation: [fastify.guards.isAdminAuthenticated],
      schema: {
        body: {
          $ref: "models-users#",
        },
        response: {
          200: {
            $ref: "models-users#",
          },
        },
      },
    },
    async function (req, reply) {
      try {
        const user = await fastify.db.user.create({
          ...req.body,
          franchise: req.scope.franchise._id,
        });
        reply.code(201).send(user);
      } catch (err) {
        console.log(err);
        reply.code(400).send({ error: err });
      }
    }
  );
  fastify.get(
    "/customer/:id/",
    {
      preValidation: [fastify.guards.isAdminAuthenticated],
      schema: {
        response: {
          200: {
            $ref: "models-users#",
          },
        },
      },
    },
    async function (req, reply) {
      try {
        const user = await fastify.db.user.findOneAndUpdate(
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
    async function (req, reply) {
      if (req.file) {
        try {
          const key = `${req.scope.franchise.slug}/customers/avatars/${req.file.filename}`;
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
    "/clubs/",
    {
      preValidation: [fastify.guards.isAdminAuthenticated],
      schema: {
        response: {
          200: {
            type: "array",
            items: {
              $ref: "models-clubs#",
            },
          },
        },
      },
    },
    async function (req, reply) {
      const clubs = await fastify.db.club
        .find({})
        .sort({ isEntryClub: 1, name: 1 });
      reply.code(200).send(clubs);
    }
  );
  fastify.post(
    "/clubs/",
    {
      preValidation: [fastify.guards.isAdminAuthenticated],
      schema: {
        body: {
          $ref: "models-clubs#",
        },
        response: {
          201: {
            $ref: "models-clubs#",
          },
        },
      },
    },
    async function (req, reply) {
      try {
        let club = await fastify.db.club.create({
          ...req.body,
          franchise: req.scope.franchise._id,
        });
        if (club.isEntryClub) {
          await fastify.db.club.updateMany(
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

  fastify.put(
    "/club/:id/",
    {
      preValidation: [fastify.guards.isAdminAuthenticated],
      schema: {
        body: {
          $ref: "models-clubs#",
        },
        response: {
          200: {
            $ref: "models-clubs#",
          },
        },
      },
    },
    async function (req, reply) {
      try {
        const club = await fastify.db.club.findOneAndUpdate(
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
};
