import { createContext } from "react";
import CountModel from "./counter";

export interface IRootStore {
  countStore: CountModel;
}

class RootStore implements IRootStore {
  countStore: CountModel;
  constructor() {
    this.countStore = new CountModel(this);
  }
}

export const store = new RootStore();

export const StoreContext = createContext<IRootStore>(store);
