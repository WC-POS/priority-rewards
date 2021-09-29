const fastify = require("fastify")({ logger: true });
const package = require("./package.json");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const start = async () => {
  try {
    const app = await fastify.register(require("fastify-jwt"), {
      secret: process.env.JWT_SECRET,
    });
    if (process.env.NODE_ENV === "development") {
      // Swagger registration - development only
      app.register(require("fastify-swagger"), {
        routePrefix: "/documentation",
        swagger: {
          info: {
            title: "Priority Rewards API",
            description: package.description,
            version: package.version,
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
      origin: [/\.lvh\.me$/],
    });
    app.register(require("./plugins/mongoose-driver"), {
      uri: `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_SERVER}/${process.env.MONGO_DB}?authSource=${process.env.MONGO_AUTH}&readPreference=primary&ssl=false`,
      useNameAndAlias: true,
      connectionSettings: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    });
    app.register(require("./plugins/franchise-scope"));
    app.register(require("./plugins/route-loader"));
    app.listen(process.env.API_PORT, "0.0.0.0");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
