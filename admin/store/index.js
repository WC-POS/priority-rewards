import create from "zustand";
import { devtools, persist } from "zustand/middleware";

let apiStore = (set) => ({
  api: {
    slug: null,
    token: {
      key: null,
      expiresAt: null,
    },
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
