import { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";

import AdminAuthRoutes from "./admin/auth";
import FranchiseRoutes from "./admin/franchise";
import FPOSRoutes from "./sync/fpos";
import MembershipRoutes from "./admin/membership";
import UtilRoutes from "./util";

const routes: FastifyPluginAsync = async (fastify, options) => {
  fastify.register(AdminAuthRoutes, { prefix: "admin/auth/" });
  fastify.register(FranchiseRoutes, { prefix: "admin/franchise/" });
  fastify.register(FPOSRoutes, { prefix: "sync/fpos/" });
  fastify.register(MembershipRoutes, { prefix: "admin/membership/" });
  fastify.register(UtilRoutes, { prefix: "util/" });

  fastify.get("/", function (req: FastifyRequest, reply: FastifyReply) {
    reply.code(200).send(req.scope);
  });
};
export default fp(routes);
