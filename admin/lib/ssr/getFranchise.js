export const getFranchiseData = async (context) => {
  const slug = context.req.headers.host.toLowerCase().split(".")[0];
  if (slug !== "admin") {
    try {
      const url = `https://${slug}.${process.env.NEXT_PUBLIC_API_HOST}/admin/franchise/`;
      const res = await fetch(url);
      if (res.ok) {
        return await res.json();
      } else {
        return undefined;
      }
    } catch (err) {
      console.log(err);
      return undefined;
    }
  } else {
    return require("../constants/admin-franchise.json");
  }
};
