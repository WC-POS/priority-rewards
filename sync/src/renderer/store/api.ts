import { GetState, SetState, State } from 'zustand';

export interface APIState extends State {
  publicKey: string | '';
  privateKey: string | '';
  get: GetFn;
  reset: () => void;
  setKeys: (newPublic: string, newPrivate: string) => void;
}

interface GetFn<T> {
  (url: string): Promise<T>;
}

const APIStore = (set: SetState<APIState>, get: GetState<APIState>) => ({
  publicKey: '',
  privateKey: '',
  fetchGet: async <T>(url: string): Promise<T> => {
    const state = get();
    const isDev = localStorage.getItem('env') === 'development';
  },
  reset: () => {
    set(() => ({ publicKey: '', privateKey: '' }));
  },
  setKeys: (newPublic: string, newPrivate: string) => {
    set(() => ({ publicKey: newPublic, privateKey: newPrivate }));
  },
});

export default APIStore;
