import SMTPTransport, { Options } from "nodemailer/lib/smtp-transport";
import nodemailer, {
  SendMailOptions,
  SentMessageInfo,
  Transporter,
} from "nodemailer";

import { AdminAccountDocument } from "../models/admin-accounts";
import { AdminAccountRegistrationCodeDocument } from "../models/admin-account-registration-code";
import { FastifyPluginCallback } from "fastify";
import { ForgotPasswordCodeDocument } from "../models/forgot-password-code";
import { FranchiseDocument } from "../models/franchises";
import { formatDuration } from "date-fns";
import fp from "fastify-plugin";

function buildAdminUrl(slug: string) {
  return `https://${slug}.admin.${
    process.env.NODE_ENV === "development" ? "lvh.me" : "priority-rewards.com"
  }`;
}

function buildNewAdminAccountEmail(
  franchise: FranchiseDocument,
  account: AdminAccountDocument,
  code: string,
  expiresIn: Duration
) {
  return {
    to: `'${account.fullname} <${account.email}>'`,
    subject: "🔐 PriorityRewards New Account",
    text: `You have been added to the ${
      franchise.name
    } PriorityRewards portal. Your registration code is the following: ${code}. This code will expire in ${formatDuration(
      expiresIn
    )}.`,
    html: `
    <p>You have been added to the ${franchise.name} PriorityRewards portal.</p>
    <p>To finish registering your account, follow the link below</p>
    <a href="${encodeURI(
      buildAdminUrl(franchise.slug) +
        "/auth/register?email=" +
        account.email +
        "&code=" +
        code +
        "/"
    )}">Register Here</a>
    <br />
    <p>Your registration code is ${code}</p>
    <p>This code and link will expire in ${formatDuration(expiresIn)}</p>
    <p>If you feel that this has been done in error, please reach out to support@priority-rewards.com</p>
    `,
  };
}

function buildForgotPasswordEmail(
  franchise: FranchiseDocument,
  account: AdminAccountDocument,
  code: string,
  expiresIn: Duration
) {
  return {
    to: `'${account.fullname} <${account.email}>'`,
    subject: "🔐 PriorityRewards Admin Account Password Recovery",
    text: `Your forgot password code is the following: ${code}. This code will expire in ${formatDuration(
      expiresIn
    )}.`,
    html: `
    <p>A password recovery request has been issued for your account in the ${
      franchise.name
    } PriorityRewards portal.</p>
    <p>To finish recovering your account, follow the link below</p>
    <a href="${encodeURI(
      buildAdminUrl(franchise.slug) +
        "/auth/forgot/redeem?code=" +
        code +
        "&email=" +
        account.email.toLowerCase()
    )}">Recover your account Here</a>
    <br />
    <p>Your recovery code is ${code}</p>
    <p>This code and link will expire in ${formatDuration(expiresIn)}</p>
    <p>If you feel that this has been done in error, please reach out to support@priority-rewards.com</p>
    `,
  };
}

const nodemailerDriver: FastifyPluginCallback<Options> = (
  fastify,
  options,
  done
) => {
  const transporter = nodemailer.createTransport(options);
  const fromEmail = options.auth!.user;

  async function sendForgotAdminPasswordEmail(
    forgotPasswordCode: ForgotPasswordCodeDocument,
    code: string,
    expiresIn: Duration
  ) {
    const adminAccount = await fastify.db.models.AdminAccount.findById(
      forgotPasswordCode.account
    );
    const franchise = await fastify.db.models.Franchise.findById(
      forgotPasswordCode.franchise
    );
    if (franchise && adminAccount) {
      const options = buildForgotPasswordEmail(
        franchise,
        adminAccount,
        code,
        expiresIn
      ) as SendMailOptions;
      options.from = fromEmail;
      return await transporter.sendMail(options);
    }
    return undefined;
  }

  async function sendNewAdminAccountEmail(
    adminAccountRegistrationCode: AdminAccountRegistrationCodeDocument,
    code: string,
    expiresIn: Duration
  ) {
    const adminAccount = await fastify.db.models.AdminAccount.findById(
      adminAccountRegistrationCode.account
    );
    const franchise = await fastify.db.models.Franchise.findById(
      adminAccountRegistrationCode.franchise
    );
    if (franchise && adminAccount) {
      const options = buildNewAdminAccountEmail(
        franchise,
        adminAccount,
        code,
        expiresIn
      ) as SendMailOptions;
      options.from = fromEmail;
      return await transporter.sendMail(options);
    }
    return undefined;
  }

  fastify.decorate("mail", {
    transporter,
    fromEmail,
    utils: {
      sendForgotAdminPasswordEmail,
      sendNewAdminAccountEmail,
    },
  });
  done();
};

declare module "fastify" {
  export interface FastifyInstance {
    mail: {
      transporter: Transporter<SentMessageInfo>;
      fromEmail: string;
      utils: {
        sendForgotAdminPasswordEmail: (
          forgotPasswordCode: ForgotPasswordCodeDocument,
          code: string,
          expiresIn: Duration
        ) => Promise<SMTPTransport.SentMessageInfo> | Promise<undefined>;
        sendNewAdminAccountEmail: (
          adminAccountRegistrationCode: AdminAccountRegistrationCodeDocument,
          code: string,
          expiresIn: Duration
        ) => Promise<SMTPTransport.SentMessageInfo> | Promise<undefined>;
      };
    };
  }
}

export default fp(nodemailerDriver);
