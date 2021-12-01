import { FastifyPluginCallback } from "fastify";
import fp from "fastify-plugin";
import { S3, S3ClientConfig } from "@aws-sdk/client-s3";

export interface S3PluginOptions {
  region: string;
  endpoint: string;
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
  };
}

const s3driver: FastifyPluginCallback<S3PluginOptions> = async (
  fastify,
  opts,
  done
) => {
  const s3 = new S3(opts as S3ClientConfig);
  fastify.decorate("s3", s3);
  done();
};

declare module "fastify" {
  export interface FastifyInstance {
    s3: S3;
  }
}

export default fp(s3driver);
