import path from "path";
import { FastifyPluginCallback } from "fastify";
import fp from "fastify-plugin";
import multer, { diskStorage } from "fastify-multer";

export const upload = multer({
  storage: diskStorage({
    destination: function (req, file, cb) {
      storage: diskStorage;
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, new Date() + path.extname(file.originalname)); //Appending extension
    },
  }),
});

const multerWrapper: FastifyPluginCallback = (fastify, options, done) => {
  fastify.register(multer.contentParser);
  fastify.decorate("upload", upload);
  done();
};

declare module "fastify" {
  export interface FastifyInstance {
    upload: typeof upload;
  }
}

export default fp(multerWrapper);
