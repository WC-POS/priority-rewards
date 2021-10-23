const fastifyPlugin = require("fastify-plugin");

function paginate(fastify, opts, done) {
  const paginate = async (queryset, pageOptions = {}) => {
    const page = pageOptions.page ? pageOptions.page : 1;
    const size = pageOptions.size ? pageOptions.size : process.env.PAGE_SIZE;
    const count = await queryset.model
      .find(queryset.getFilter())
      .count()
      .exec();
    const results = await queryset
      .skip(size * (page - 1))
      .limit(size)
      .exec();
    const maxPage = Math.ceil(count / size);
    return {
      count,
      page,
      maxPage,
      results: results.map((result) => result.toJSON()),
    };
  };
  fastify.decorate("paginate", paginate);
  done();
}

module.exports = fastifyPlugin(paginate);
