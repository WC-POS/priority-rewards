const fastifyPlugin = require("fastify-plugin");
const fs = require("fs");
const aws = require("@aws-sdk/client-s3");

async function s3driver(fastify, opts, done) {
  const s3 = new aws.S3({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKeyId: process.env.AWS_SECRET_ACCESS_KEY,
    endpoint: process.env.AWS_ENDPOINT,
  });
  fastify.decorate("s3", s3);
  done();
}

module.exports = fastifyPlugin(s3driver);
