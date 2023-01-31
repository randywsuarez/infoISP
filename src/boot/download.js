import env from '../utils/env'
function descargar(val) {
	val = env.apiUrl + '/' + val
	console.log(val)
	window.saveAs(val, val.substring(val.lastIndexOf('/') + 1, val.length))
}
export default ({ Vue }) => {
	Vue.prototype.$download = descargar
}
