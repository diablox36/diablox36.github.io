export default class CookieManager {
  addItem(key, value) {
    const valueString = JSON.stringify(value)
    document.cookie = `${key}=${valueString}; SameSite=Strict;`
  }

  getItem(key) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(`${key}=`)) {
        const valueString = cookie.substring(key.toString().length + 1);
        if (valueString && valueString.startsWith('{')) {
          return JSON.parse(valueString);
        }
      }
    }
    return null;
  }

  getAllItems() {
    const cookies = document.cookie.split(';');
    const items = [];
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      const [key, valueString] = cookie.split('=');
      if (valueString && valueString.startsWith('{')) {
        const value = JSON.parse(valueString);
        items.push([key, value]);
      }
    }
    return items;
  }

  removeItem(key) {
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Strict;`
  }

  clear() {
    const cookies = document.cookie.split(';')
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim()
      const [key] = cookie.split('=')
      document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Strict;`
    }
  }
}