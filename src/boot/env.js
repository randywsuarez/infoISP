import { env } from '../utils'

export default ({ Vue }) => {
  Vue.prototype.$env = env
}
