import { http_async, Storage, env, Auth } from './'
import _ from 'lodash'
import Vue from 'vue'
import store from '@/store/store'
import { mapActions, mapMutations } from 'vuex'

export default function (mod, config) {

	var save = mod+JSON.stringify(config)

	var user_id = Storage.get('user_id') || ''

	_.forEach(config, (val, action) => {

		var cache_data = Storage.get(JSON.stringify({
            url: val.url,
            params: val.params
        })+user_id)

        var methods = {}

        if(!val.isMutation){
            methods = {
                ...mapActions(mod, {
                    sync_data: action
                })
            }
        }
        else{
            methods = {
                ...mapMutations(mod, {
                    sync_data:action
                })
            }
        }

	    const bus = new Vue({
	        store,
	        methods
	    })


	    if(!env.saveSync[save]){

			env.system.on('/'+val.url, () => {

				if(!Auth.isLogued())
					return

				var params = val.params ? JSON.parse(JSON.stringify(val.params)) : {}
				params._noSync = true
				http_async(val.url, {
					store: {
						module: mod,
						action: !val.isMutation ? action : null,
						mutation: val.isMutation ? action : null
					},
					notLoading: true,
					notQueue: true
				}).get(params)
			})
		}

		if(!env.isLoading && cache_data===undefined){
			env.isLoading = true
			env.loading = env.bus.$loading({
                lock: true,
                text: 'Cargando...',
            });
		}
		else if(cache_data!==undefined){
			bus.sync_data(cache_data)
		}

		http_async(val.url, {
			store: {
				module: mod,
				action: !val.isMutation ? action : null,
				mutation: val.isMutation ? action : null
			},
			notLoading: true
		}).get(val.params)

	})

	env.saveSync[save] = true

}