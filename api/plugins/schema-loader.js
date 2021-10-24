const fs = require("fs");
const path = require("path");
const fastifyPlugin = require("fastify-plugin");

async function schemaLoader(fastify, opts, done) {
  const fileLoop = async (f) => {
    let isDir = (await fs.promises.stat(f)).isDirectory();
    if (isDir) {
      let contents = await fs.promises.readdir(f);
      let { files, directories } = contents.reduce(
        (acc, curr) => {
          let p = path.join(f, curr);
          if (fs.statSync(p).isDirectory()) {
            acc.directories.push(p);
          } else {
            acc.files.push(p);
          }
          return acc;
        },
        {
          files: [],
          directories: [],
        }
      );
      files.forEach((file) => {
        const splitPath = file.split(path.sep);
        fastify.addSchema({
          $id: splitPath[splitPath.length - 1].split(".")[0],
          ...require(file),
        });
      });
      for (dir of directories) {
        await fileLoop(dir);
      }
    } else {
      console.log(f);
      const splitPath = f.split(path.sep);
      fastify.addSchema({
        $id: splitPath[splitPath.length - 1].split(".")[0],
        ...require(f),
      });
    }
  };

  let schemaDir = path.resolve(__dirname, "..", "schema/");
  try {
    await fileLoop(schemaDir);
  } catch (err) {
    console.log(err);
  }
  done();
}

module.exports = fastifyPlugin(schemaLoader);
