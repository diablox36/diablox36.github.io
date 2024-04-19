export default class SessionStorageManager {
    constructor() {}
  
    addItem(key, value) {
      const valueString = JSON.stringify(value);
      sessionStorage.setItem(key, valueString);
    }
  
    getItem(key) {
      const item = sessionStorage.getItem(key);
      return JSON.parse(item);
    }
  
    getAllItems() {
      const items = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        const item = this.getItem(key);
        items.push([key, item]);
      }
      return items;
    }
  
    removeItem(key) {
      sessionStorage.removeItem(key);
    }
    
    clear() {
      sessionStorage.clear();
    }
  }