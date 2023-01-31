import { env, Storage } from './'
var counterpart = require('counterpart');
import axios from 'axios'

export default function(url,config){
    return {
        get: function(data){
            return axios({
                method: 'get',
                url: env.apiUrl+'/'+url,
                params: data,
                cancelToken: config && config.cancelToken ? config.cancelToken : null,
                headers: {
                    'Accept-Language': counterpart.getLocale(),
                    'Content-Type': 'application/json',
                    Authorization: Storage.get('token')
                }
            });
        },
        post: function(data){
            return axios({
                method: 'post',
                url: env.apiUrl+'/'+url,
                data: data,
                headers: {
                    'Accept-Language': counterpart.getLocale(),
                    'Content-Type': 'application/json',
                    Authorization: Storage.get('token')
                }
            });
        },
        put: function(data){
            return fetch(env.apiUrl+'/'+url,{
                method: 'put',
                body: JSON.stringify(data)
            }).then(response=>{
                return response.json()
            })
        },
        delete: function(data){
            return axios({
                method: 'delete',
                url: env.apiUrl+'/'+url,
                data: data,
                headers: {
                    'Accept-Language': counterpart.getLocale(),
                    'Content-Type': 'application/json',
                    Authorization: Storage.get('token')
                }
            });
        }
    }
}