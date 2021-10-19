const fastifyPlugin = require("fastify-plugin");
const nodemailer = require("nodemailer");

async function nodemailerDriver(fastify, opts, done) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: Boolean(Number(process.env.EMAIL_SECURE)),
    auth: {
      user: process.env.EMAIL_AUTH_USER,
      pass: process.env.EMAIL_AUTH_PASS,
    },
  });
  const fromEmail = process.env.EMAIL_AUTH_USER;
  fastify.decorate("mail", { transporter, fromEmail });
  done();
}

module.exports = fastifyPlugin(nodemailerDriver);
