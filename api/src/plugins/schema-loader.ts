import fs from "fs";
import path from "path";

import { FastifyInstance, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

const fileLoop = async function (f: string, fastify: FastifyInstance) {
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
        files: [] as string[],
        directories: [] as string[],
      }
    );
    files.forEach((file) => {
      const splitPath = file.split(path.sep);
      fastify.addSchema({
        $id: splitPath[splitPath.length - 1].split(".")[0],
        ...require(file),
      });
    });
    for (const dir of directories) {
      await fileLoop(dir, fastify);
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

const schemaLoader: FastifyPluginAsync<{}> = async (fastify, opts) => {
  let schemaDir = path.resolve(__dirname, "..", "schema/");
  try {
    await fileLoop(schemaDir, fastify);
  } catch (err) {
    console.log(err);
  }
};

export default fp(schemaLoader);
