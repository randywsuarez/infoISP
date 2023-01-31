import instance from '../utils/axios'

export default ({ Vue }) => {
	Vue.prototype.$axios = instance
}
