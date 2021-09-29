export async function getServerSideProps({ req, res }) {
  let storeSlug = req.headers.host.toLowerCase().split(".")[0];
  let store = storeSlug === "admin" ? storeSlug : null;
  const statusCode = store === null ? 404 : 200;
  if (statusCode >= 400) {
    res.statusCode = 404;
  }
  return {
    props: {
      host: req.headers.host,
      statusCode,
      store,
    },
  };
}
