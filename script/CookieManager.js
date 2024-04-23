export default class CookieManager {
  addItem(key, value) {
    const valueString = JSON.stringify(value)
    document.cookie = `${key}=${valueString}; SameSite=Strict;`
  }

  getItem(key) {
    const items = this.getAllItems();
    for (let item of items) {
      if (item.key == key) {
        return item
      }
    }
    return null
  }

  getAllItems() {
    const cookies = document.cookie.split(';')
    const items = []

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim()
      const [key, valueString] = cookie.split('=')
      if (valueString && valueString.startsWith('{')) {
        const value = JSON.parse(valueString)
        items.push({
          'key': key,
          'value': value,
        })
      }
    }
    return items
  }

  getRawItems(){
    const cookies = document.cookie
    return cookies
  }

  removeItem(key) {
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Strict;`
  }
}