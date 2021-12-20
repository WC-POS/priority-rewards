import db from "./plugins/mongoose-driver";
import { fastify } from "fastify";
import fastifyJwt from "fastify-jwt";
import fastifyLog from "fastify-log";
import nodemailerDriver from "./plugins/nodemailer-driver";
import path from "path";
import pino from "pino";
import pinoColada from "pino-colada";
import s3driver from "./plugins/s3-driver";

require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const start = async () => {
  try {
    const app = fastify({
      logger: pino({ level: "info", prettyPrint: {}, prettifier: pinoColada }),
    });

    app.register(fastifyJwt, {
      secret: process.env.JWT_SECRET,
    });

    if (process.env.NODE_ENV === "development") {
      app.register(require("fastify-swagger"), {
        routePrefix: "/documentation",
        swagger: {
          info: {
            title: "Priority Rewards API",
            description: "API for PriorityRewards",
            version: "0.1.0",
          },
          host: "api.lvh.me",
          schemes: ["https"],
          consumes: ["application/json"],
          produces: ["application/json"],
          tags: [
            { name: "auth", description: "Authentication related end-points" },
            { name: "admin", description: "Admin related end-points" },
            { name: "user", description: "User related end-points" },
            { name: "store", description: "Store related end-points" },
          ],
        },
        uiConfig: {
          docExpansion: "full",
          deepLinking: false,
        },
        exposeRoute: true,
      });
    }

    app.register(require("fastify-cors"), {
      // origin: [/\.lvh\.me$/],
      origin: "*",
    });
    app.register(require("./plugins/multer-wrapper"));
    app.register(db, {
      uri: `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_SERVER}/${process.env.MONGO_DB}?authSource=${process.env.MONGO_AUTH}&readPreference=primary&ssl=false`,
      connectionSettings: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    });
    app.register(nodemailerDriver, {
      name: process.env.EMAIL_NAME,
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: Boolean(process.env.EMAIL_SECURE),
      auth: {
        user: process.env.EMAIL_AUTH_USER,
        pass: process.env.EMAIL_AUTH_PASS,
      },
      tls: {
        ciphers: "SSLv3",
      },
    });
    app.register(s3driver, {
      region: process.env.AWS_REGION,
      endpoint: process.env.AWS_ENDPOINT,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
    app.register(require("./plugins/guards"));
    app.register(require("./plugins/paginate"));
    app.register(require("./plugins/schema-loader"));
    app.register(require("./routes"));
    app.listen(
      parseInt(process.env.API_PORT ? process.env.API_PORT : "8000"),
      "0.0.0.0"
    );
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

start();
