const { Types } = require("mongoose");

module.exports = async function (fastify, options) {
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
