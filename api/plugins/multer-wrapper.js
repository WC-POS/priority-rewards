const path = require("path");
const fastifyPlugin = require("fastify-plugin");
const multer = require("fastify-multer");

async function multerWrapper(fastify, opts, done) {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
    },
  });
  const upload = multer({ storage });
  fastify.register(multer.contentParser);
  fastify.decorate("upload", upload);
  done();
}

module.exports = fastifyPlugin(multerWrapper);
