import APIStore, { APIState } from './api';
import FranchiseStore, { FranchiseState } from './franchise';
import create, { GetState, SetState } from 'zustand';

import { StoreApiWithSubscribeWithSelector } from 'zustand/middleware';

export const useAPIStore = create<
  APIState,
  SetState<APIState>,
  GetState<APIState>,
  StoreApiWithSubscribeWithSelector<APIState>
>(APIStore);
export const useFranchiseStore = create<
  FranchiseState,
  SetState<FranchiseState>,
  GetState<FranchiseState>,
  StoreApiWithSubscribeWithSelector<FranchiseState>
>(FranchiseStore);
