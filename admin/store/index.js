import create from "zustand";
import { devtools, persist } from "zustand/middleware";

let apiStore = (set, get) => ({
  api: {
    slug: null,
    token: {
      key: null,
      expiresAt: null,
    },
  },
  fetchGet: async (endpoint, body = null) => {
    const urlPoints = endpoint
      .trim()
      .split("/")
      .filter((urlPoint) => urlPoint !== "");
    let state = get();
    let payload = {};
    try {
      let params = {
        method: "GET",
        headers: {
          authorization: `Bearer ${state.token.key}`,
        },
      };
      if (body) {
        params.body = body;
      }
      const res = await fetch(
        `https://${state.slug}.${
          process.env.NEXT_PUBLIC_API_HOST
        }/${urlPoints.join("/")}/`,
        params
      );
      try {
        const data = await res.json();
        payload = { status: res.status, ok: res.ok, body: data, error: null };
      } catch (err) {
        payload = { status: res.status, ok: res.ok, body: {}, error: err };
      }
    } catch (err) {
      payload = { status: 999, ok: false, body: {}, error: err };
    }
    return payload;
  },
  fetchPost: async (endpoint, body, isPUT = false) => {
    const urlPoints = endpoint
      .trim()
      .split("/")
      .filter((urlPoint) => urlPoint !== "");
    let state = get();
    let payload = {};
    try {
      const res = await fetch(
        `https://${state.slug}.${
          process.env.NEXT_PUBLIC_API_HOST
        }/${urlPoints.join("/")}/`,
        {
          method: isPUT ? "PUT" : "POST",
          headers: {
            authorization: `Bearer ${state.token.key}`,
            "Content-Type": "application/json",
          },
          body: body ? JSON.stringify(body) : JSON.stringify({}),
        }
      );
      try {
        const data = await res.json();
        payload = { status: res.status, ok: res.ok, body: data, error: null };
      } catch (err) {
        payload = { status: res.status, ok: res.ok, body: {}, error: err };
      }
    } catch (err) {
      payload = { status: 999, ok: false, body: {}, error: err };
    }
    return payload;
  },
  fetchUpload: async (endpoint, data) => {
    const urlPoints = endpoint
      .trim()
      .split("/")
      .filter((urlPoint) => urlPoint !== "");
    let state = get();
    let payload = {};
    try {
      let formData = new FormData();
      data.forEach((file) => {
        console.log("file", file);
        formData.append(file.name, file.data);
      });
      console.log(data);
      console.log(formData);
      const res = await fetch(
        `https://${state.slug}.${
          process.env.NEXT_PUBLIC_API_HOST
        }/${urlPoints.join("/")}/`,
        {
          method: "POST",
          headers: {
            authorization: `Bearer ${state.token.key}`,
          },
          body: formData,
        }
      );
      try {
        const data = await res.json();
        payload = { status: res.status, ok: res.ok, body: data, error: null };
      } catch (err) {
        payload = { status: res.status, ok: res.ok, body: {}, error: err };
      }
    } catch (err) {
      payload = { status: 999, ok: false, body: {}, error: err };
    }
    return payload;
  },
  setSlug: (slug) => {
    set(() => ({ slug }));
  },
  setToken: (token) => {
    set(() => ({ token }));
  },
  reset: () => {
    set(() => ({
      slug: null,
      token: {
        key: null,
        expiresAt: null,
      },
    }));
  },
});

let franchiseStore = (set) => ({
  franchise: {},
  setFranchise: (franchise) => {
    set(() => ({ franchise: { ...franchise } }));
  },
  reset: () => {
    set(() => ({ franchise: {} }));
  },
});

let accountStore = (set) => ({
  account: {},
  setAccount: (account) => {
    set(() => ({ account: { ...account } }));
  },
  reset: () => {
    set(() => ({ account: {} }));
  },
});

accountStore = devtools(accountStore);
apiStore = devtools(apiStore);
franchiseStore = devtools(franchiseStore);

export const useAccountStore = create(accountStore);
export const useAPIStore = create(apiStore);
export const useFranchiseStore = create(franchiseStore);
