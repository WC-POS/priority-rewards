export const getSlug = (context) => {
  return context.req.headers.host.toLowerCase().split(".")[0];
};
