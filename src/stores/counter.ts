import { makeAutoObservable, reaction } from 'mobx';
import { IRootStore } from './rootStore';

export default class Counter {
  count = 0;
  rootStore: IRootStore;
  constructor(rootStore: IRootStore) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.rootStore = rootStore;
    if (localStorage.getItem('count')) {
      this.count = parseInt(localStorage.getItem('count')!);
    }
    reaction(
      () => this.count,
      () => {
        localStorage.setItem('count', this.count + '');
      }
    );
  }
  increase() {
    this.count++;
  }
  descrease() {
    this.count--;
  }
}
