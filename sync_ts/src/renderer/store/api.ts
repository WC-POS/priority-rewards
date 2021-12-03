import { SetState, State } from 'zustand';

export interface APIState extends State {
  publicKey: string | '';
  privateKey: string | '';
  reset: () => void;
  setKeys: (newPublic: string, newPrivate: string) => void;
}

const APIStore = (set: SetState<APIState>) => ({
  publicKey: '',
  privateKey: '',
  reset: () => {
    set(() => ({ publicKey: '', privateKey: '' }));
  },
  setKeys: (newPublic: string, newPrivate: string) => {
    set(() => ({ publicKey: newPublic, privateKey: newPrivate }));
  },
});

export default APIStore;
