
/**
 * Convierte el asset de una URL en 
 * base 64
 * @param {string} url Dirección Url.
 * @return {string}
 */
const assetTo64 = async url => fetch(url)
.then(response => response.blob())
.then(blob => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onloadend = () => resolve(reader.result)
  reader.onerror = reject
  reader.readAsDataURL(blob)
}))

export default assetTo64