import { FastifyPluginCallback } from "fastify";
import fp from "fastify-plugin";
import nodemailer, { Transporter, SentMessageInfo } from "nodemailer";

export interface NodemailerPluginOptions {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  tls: {
    ciphers: string;
  };
}

const nodemailerDriver: FastifyPluginCallback<NodemailerPluginOptions> = (
  fastify,
  options,
  done
) => {
  const transporter = nodemailer.createTransport(options);
  const fromEmail = options.auth.user;
  fastify.decorate("mail", { transporter, fromEmail });
  done();
};

declare module "fastify" {
  export interface FastifyInstance {
    mail: {
      transporter: Transporter<SentMessageInfo>;
      fromEmail: string;
    };
  }
}

export default fp(nodemailerDriver);
