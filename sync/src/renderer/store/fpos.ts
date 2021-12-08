import { SetState, State } from 'zustand';

export interface FPOSState extends State {
  connected: boolean;
  db: {
    name: string;
    host: string;
  };
  reset: () => void;
  setConnected: (val: boolean) => void;
  setDB: (name: string, host: string) => void;
}

const FPOSStore = (set: SetState<FPOSState>) => ({
  connected: false,
  db: {
    name: '',
    host: '',
  },
  reset: () => {
    set(() => ({ connected: false, db: { name: '', host: '' } }));
  },
  setConnected: (connected: boolean) => {
    set(() => ({ connected }));
  },
  setDB: (name: string, host: string) => {
    set(() => ({ db: { name, host } }));
  },
});

export default FPOSStore;
