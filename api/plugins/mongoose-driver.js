const fs = require("fs");
const path = require("path");
const fastifyPlugin = require("fastify-plugin");
const mongoose = require("mongoose");

const buildModelSchema = (name, schema, options, methods) => {
  let modelSchema = new mongoose.Schema(schema, {
    ...options,
    collection: name,
  });
  console.log(modelSchema.options.collection);
  if (methods.virtual) {
    Object.keys(methods.virtual).forEach((key) => {
      modelSchema.virtual(key).get(methods.virtual[key]);
    });
  }
  if (methods.methods) {
    Object.keys(methods.methods).forEach((key) => {
      modelSchema.methods[key] = methods.methods[key];
    });
  }
  if (methods.static) {
    Object.keys(methods.static).forEach((key) => {
      modelSchema.statics[key] = methods.static[key];
    });
  }
  if (methods.presave) {
    modelSchema.pre("save", methods.presave);
  }
  if (methods.postsave) {
    modelSchema.post("save", methods.postsave);
  }
  return modelSchema;
};

async function moongooseDriver(fastify, opts, done) {
  let decorator = { db: null };
  let modelDir = path.resolve(__dirname, "..", "models/");
  try {
    // Create Mongoose Model and append decorator as fastify.db[ModelAlias]
    decorator.db = await mongoose.connect(opts.uri, opts.connectionSettings);
    let modelFiles = await fs.promises.readdir(modelDir);
    modelFiles.forEach((file) => {
      let modelFile = require(path.resolve(modelDir, file));
      if (modelFile.schemaOptions && modelFile.schemaOptions.timestamps) {
        modelFile.schema.createdAt = Number;
        modelFile.schema.updatedAt = Number;
        modelFile.schemaOptions.timestamps = {
          currentTime: () => Math.floor(Date.now() / 1000),
        };
      }

      let modelSchema = buildModelSchema(
        modelFile.name,
        modelFile.schema,
        modelFile.schemaOptions,
        {
          virtual: modelFile.virtual,
          methods: modelFile.methods,
          static: modelFile.static,
          presave: modelFile.presave,
          postsave: modelFile.postsave,
        }
      );
      let model = decorator.db.model(modelFile.name, modelSchema);
      decorator[[modelFile.alias ? modelFile.alias : modelFile.name]] = model;

      // Analyze Model Schema to generate Fastify Schema
      let paths = model.schema.paths;
      let fastifySchema = {
        $id: `models-${file.split(".")[0]}`,
        type: "object",
        properties: {},
        required: [],
      };

      for (const [path, schema] of Object.entries(paths)) {
        if (path !== "__v") {
          if (schema.instance === "ObjectID") {
            fastifySchema.properties[path] = { type: "string" };
          } else if (schema.instance === "Array") {
          } else if (path.includes(".")) {
            if (fastifySchema.properties[path.split(".")[0]]) {
              fastifySchema.properties[path.split(".")[0]].properties[
                path.split(".")[1]
              ] = {
                type: schema.instance.toLowerCase(),
              };
            } else {
              fastifySchema.properties[path.split(".")[0]] = {
                type: "object",
                properties: {
                  [path.split(".")[1]]: { type: schema.instance.toLowerCase() },
                },
              };
            }
          } else {
            fastifySchema.properties[path] = {
              type: schema.instance.toLowerCase(),
            };
          }

          if (schema.options.required) {
            fastifySchema.required.push(path);
          }
          if (schema.options.nullable !== undefined) {
            fastifySchema.properties[path].nullable = schema.options.nullable;
          }
          if (schema.enumValues && schema.enumValues.length) {
            fastifySchema.properties[path].enum = schema.enumValues;
          }
        }
      }
      fastify.addSchema(fastifySchema);
    });
  } catch (err) {
    throw new Error(err);
  }

  fastify.addHook("onClose", (app, done) => {
    app.mongoose.db.on("close", function () {
      done();
    });
    app.mongoose.db.close();
  });
  fastify.decorate("db", decorator);
  console.log("Loaded Models & Schema");
  console.log("----------------------");
  Object.keys(fastify.getSchemas()).forEach((key) => console.log(key));
  done();
}

module.exports = fastifyPlugin(moongooseDriver);
