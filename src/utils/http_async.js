import { env, Storage, catchErrors } from './'
import axios from 'axios'
import Vue from 'vue'
// import store from '@/store/store'
// import { mapActions, mapMutations } from 'vuex'
// import _ from 'lodash'

var loading = false

export default function(url,config = {}){

    // var methods = {}

    // if(config && config.store){
    //     if(config.store.action){
    //         methods = {
    //             ...mapActions(config.store.module, {
    //                 sync_data: config.store.action
    //             })
    //         }
    //     }
    //     else{
    //         methods = {
    //             ...mapMutations(config.store.module, {
    //                 sync_data: config.store.mutation
    //             })
    //         }
    //     }
    // }

    // const bus = new Vue({
    //     store,
    //     methods
    // })

    // var user_id = Storage.get('user_id') || ''

    const save_store = (data, url) => {
        // bus.sync_data(config.store.passUrl ? { url, data } : data)
    }

    const http = async (method, data, params = {}) => {

        // var the_url = JSON.stringify({
        //     url: url,
        //     params: params
        // })
        // var cache_data = Storage.get(the_url+user_id)

        //console.log(url, cache_data)

        // if(cache_data!==undefined && method=='get' && config && config.store){
        //     save_store(cache_data, the_url)
        //     http_real(method, data, params, true)
        //     return cache_data
        // }
        // else{
        //     if(!config || !config.store && method=='get'){
        //         // params._noSync = true
        //         config.notQueue = true
        //     }
            return await http_real(method, data, params)
        // }

    }

    const http_real = async (method, data, params, cache_data) => {

        // if(config && config.noSync)
            // params._noSync = true

        // var nLoading = Storage.get('loading')
        // Storage.set('loading', nLoading++)

        // if((!config || !config.notLoading) && !loading && !cache_data){
            // loading = bus.$loading({
            //     lock: true,
            //     text: 'Cargando...',
            // });
        // }

        return new Promise(async resolve => {

            const processResult = result => {
                // if(method!='get' && (!config || !config.notNotify)){
                    // bus.$message({
                    //     message: 'Transacción exitosa...',
                    //     type: 'success'
                    // });
                // }

                // nLoading = Storage.get('loading')
                // Storage.set('loading', nLoading--)

                // setTimeout(()=>{
                //     nLoading = Storage.get('loading')
                //     if(nLoading==0 && loading){
                //         loading.close()
                //         loading = false
                //     }
                // }, 500)

                // if(method=='get'){

                    // if(params)
                        // delete params._noSync

                    // if(_.isEmpty(params))
                        // params = undefined

                    // var save_url = JSON.stringify({
                    //     url: url,
                    //     params: params
                    // })

                    // Storage.set(save_url+user_id, result.data.data)

                    // if(config && config.store)
                        // save_store(result.data.data, save_url)
                // }


                resolve(result.data)
            }

            const processErrors = error => {
                catchErrors(error)
                // env.loading--
                // nLoading = Storage.get('loading')
                // Storage.set('loading', nLoading--)
                // setTimeout(()=>{
                //     nLoading = Storage.get('loading')
                //     if(nLoading==0 && loading){
                //         loading.close()
                //         loading = false
                //     }
                // }, 1000)
                resolve(null)
            }

            const request = {
                method: method,
                url: env.apiUrl+'/'+url,
                params: params,
                data: data,
                cancelToken: config && config.cancelToken ? config.cancelToken : null,
                headers: {
                    'Accept-Language': 'es',
                    'Content-Type': 'application/json',
                    // Authorization: Storage.get('token')
                }
            }

            // if(!config || !config.notQueue){

            //     env.queue.push(async () => {
            //         axios(request)
            //         .then(processResult)
            //         .catch(error => {
            //             processErrors(error)
            //         })
            //     })

            // }
            // else{

                try{

                    const result = await axios(request)
                    processResult(result)

                }
                catch(error){
                    processErrors(error)
                }

            // }

        })

    }

    return {
        get: async data => {
            return await http('get', null, data)
        },
        post: async (data,params) => {
            return await http('post', data, params)
        },
        put: async (data,params) => {
            return await http('put', data, params)
        },
        delete: async function(data,params){
            return await http('delete', data, params)
        }
    }
}