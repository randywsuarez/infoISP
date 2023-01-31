import _ from 'lodash'
import { Headbar, Listable } from 'components'
import { genButtons, http } from 'utils'

export default function(params){

    const { name, urlState, url, title, buttonsTop, buttonsItems, fields, search, collection, only } = params

    return {
        name: name,
        url: urlState,
        views: {
            'headbar@admin': Headbar,
            'contain@admin': Listable,
        },
        resolve: [
            {
                token: 'title',
                resolveFn: ()=>title
            },
            {
                token: 'items',
                resolveFn: ()=>http(url).get({
                    only: only
                })
            },
            {
                token: 'configListable',
                resolveFn: ()=> {
                    return {
                        url: url,
                        top: {
                            search: search,
                            buttons: genButtons(buttonsTop, collection)
                        },
                        items: {
                            actions: genButtons(buttonsItems, collection),
                            fields: fields,
                            collection: collection,
                            only: only
                        }
                    }
                }
            }
        ]
    }
}
