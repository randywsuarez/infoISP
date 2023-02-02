import axios from 'axios'
import { Notify } from 'quasar'
import { LocalStorage } from 'quasar'
import env from '../utils/env'

const instance = axios.create({
	// baseURL: 'http://localhost:3000/api/',
	baseURL: env.apiUrl,
	// timeout: 1000,
	// headers: {'X-Custom-Header': 'foobar'}
})

export default instance
