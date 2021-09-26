import { action, makeObservable, observable } from "mobx";

import { fetchLooks } from "./fetchLooks";

export class LooksStore {

  looks = [];
  isloading = true;
  isOutOfDate = true;
  error= null; 

  constructor() {
    makeObservable(this, {
      looks: observable,
      isloading: observable,
      isOutOfDate: observable,
      setIsOutOfDate: action,
      error: observable,
      loadLooks: action,
    });
  }

  setIsOutOfDate = (isOutOfDate) => {
    this.isOutOfDate = isOutOfDate;
  };

  /* mobx store
  @action
  loadLooks(){ 
    loadlooks() 
    set hier the looks
    // await -> run_in_action  
  }
  */

  loadLooks = async () => {
    try {
      const looks = await fetchLooks();
      this.looks = looks;
      this.isloading = false;
      this.IsOutOfDate = false;
    } catch (error) {
      console.log(error.message);
      this.error = error.message;
    }
  };
}

export const looksStore = new LooksStore();