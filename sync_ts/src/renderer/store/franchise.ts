import { Franchise, Location } from 'types';
import { SetState, State, UseBoundStore } from 'zustand';

export interface FranchiseState extends State {
  franchise: Franchise | null;
  location: Location | null;
  reset: () => void;
  setFranchise: (franchise: Franchise) => void;
  setLocation: (location: Location) => void;
}

const FranchiseStore = (set: SetState<FranchiseState>) => ({
  franchise: null,
  location: null,
  reset: () => {
    set(() => ({ franchise: null, location: null }));
  },
  setFranchise: (franchise: Franchise) => {
    set(() => ({ franchise }));
  },
  setLocation: (location: Location) => {
    set(() => ({ location }));
  },
});

export default FranchiseStore;
