import { httpAsync, toFormData, env } from '../utils'
import { openURL } from 'quasar'

export default ({ Vue }) => {
  Vue.prototype.$files = url => ({
  	put(file){
  		//console.log(file)
  		return new Promise(async resolve => {
  			await httpAsync('upload').post(toFormData({
  				path: url,
  				file
  			}))
  			resolve(url)
  		})
  	},
    get(){
      openURL(env.apiUrl + '/' + url)
    }
  })
}
