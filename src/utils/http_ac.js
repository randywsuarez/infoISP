import { env, Storage, catchErrors, xmlToJson, toast, http_async, toFormData } from './'
var counterpart = require('counterpart');
import axios from 'axios'
import 'babel-polyfill';

export default async function(data){

    try{
        // const result = await axios({
        //     method: 'get',
        //     url: env.acUrl+'/api/xml',
        //     params: data,
        //     // headers: {
        //         // transformRequest: angular.identity,
        //         headers: {'Content-Type': undefined}
        //     // }
        // });

        if(Storage.get('cookieAc'))
            data.session = Storage.get('cookieAc')

        const result = await http_async('misc/proxy').post({
            url: env.acUrl+'/api/xml',
            method: 'get',
            params: data
        })

        return JSON.parse(xmlToJson(result).replace('undefined',''))

    }
    catch(error){
        //console.log(error)
        toast.error('Ha ocurrido un error al conectar con adobe connect',error)
        return null
    }

    // return {
    //     get: async data => {
    //         try{
    //             const result = await axios({
    //                 method: 'get',
    //                 url: env.acUrl+'/api/xml'+url,
    //                 params: data,
    //                 cancelToken: config && config.cancelToken ? config.cancelToken : null,
    //                 headers: {
    //                     'Accept-Language': counterpart.getLocale(),
    //                     'Content-Type': 'application/json',
    //                     Authorization: Storage.get('token')
    //                 }
    //             });
    //             return xmlToJson(result.data)
    //         }
    //         catch(error){
    //             catchErrors(error)
    //             return null
    //         }

    //         // return axios({
    //         //     method: 'get',
    //         //     url: env.apiUrl+'/'+url,
    //         //     params: data,
    //         //     cancelToken: config && config.cancelToken ? config.cancelToken : null,
    //         //     headers: {
    //         //         'Accept-Language': counterpart.getLocale(),
    //         //         'Content-Type': 'application/json',
    //         //         Authorization: Storage.get('token')
    //         //     }
    //         // });
    //     },
    //     post: async (data,params) => {

    //         try{
    //             const result = await axios({
    //                 method: 'post',
    //                 url: env.apiUrl+'/'+url,
    //                 data: data,
    //                 params: params,
    //                 cancelToken: config && config.cancelToken ? config.cancelToken : null,
    //                 headers: {
    //                     'Accept-Language': counterpart.getLocale(),
    //                     'Content-Type': 'application/json',
    //                     Authorization: Storage.get('token')
    //                 }
    //             });
    //             return result.data
    //         }
    //         catch(error){
    //             catchErrors(error)
    //             return null
    //         }

    //         // return axios({
    //         //     method: 'post',
    //         //     url: env.apiUrl+'/'+url,
    //         //     data: data,
    //         //     headers: {
    //         //         'Accept-Language': counterpart.getLocale(),
    //         //         'Content-Type': 'application/json',
    //         //         Authorization: Storage.get('token')
    //         //     }
    //         // });
    //     },
    //     put: function(data){
    //         return fetch(env.apiUrl+'/'+url,{
    //             method: 'put',
    //             body: JSON.stringify(data)
    //         }).then(response=>{
    //             return response.json()
    //         })
    //     },
    //     delete: async function(data,params){
    //         // return axios({
    //         //     method: 'delete',
    //         //     url: env.apiUrl+'/'+url,
    //         //     data: data,
    //         //     headers: {
    //         //         'Accept-Language': counterpart.getLocale(),
    //         //         'Content-Type': 'application/json',
    //         //         Authorization: Storage.get('token')
    //         //     }
    //         // });
    //         try{
    //             const result = await axios({
    //                 method: 'delete',
    //                 url: env.apiUrl+'/'+url,
    //                 data: data,
    //                 params: params,
    //                 cancelToken: config && config.cancelToken ? config.cancelToken : null,
    //                 headers: {
    //                     'Accept-Language': counterpart.getLocale(),
    //                     'Content-Type': 'application/json',
    //                     Authorization: Storage.get('token')
    //                 }
    //             });
    //             return result.data
    //         }
    //         catch(error){
    //             catchErrors(error)
    //             return null
    //         }
    //     }
    // }
}