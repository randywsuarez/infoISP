import _ from 'lodash'
import { Headbar, Listable, Formidable } from 'components'
import { copy, http, genButtons } from 'utils'

export default function(states,params){

    const { stateBase, urlBase, apiBase, titles, model, list, create, edit, searchBy, collection, only } = params

    const sectionsForm = sections => {
        var s = []
        _.forEach(sections,section=>{
            var c = []
            _.forEach(section.cols,col=>{
                var f = []
                _.forEach(col.fields,(val,key)=>{
                    var v = copy(model[val])
                    v.model = val
                    f.push(v)
                })
                c.push({fields: f, width: col.width})
            })
            s.push({cols: c})
        })
        return s
    }

    // sectionsForm(create.sections)

    var viewsC = {
        'modal@': Formidable,
    }

    if(!create.inModal){
        viewsC = {
            'contain@admin': Formidable
        }
    }

    var viewsE = {
        'modal@': Formidable,
    }

    if(!edit){
        viewsE = viewsC
    }
    else if(edit && !edit.inModal){
        viewsE = {
            'contain@admin': Formidable
        }
    }

    //console.log(viewsE,stateBase)


    states.push({
        name: stateBase,
        url: urlBase,
        views: {
            'headbar@admin': Headbar,
            'contain@admin': Listable,
        },
        resolve: [
            {
                token: 'title',
                resolveFn: ()=>titles.list
            },
            {
                token: 'items',
                resolveFn: ()=>http(apiBase).get({
                    only: list.only,
                    search_fields: list.params && list.params.search_fields ? list.params.search_fields : null,
                    search_values: list.params && list.params.search_values ? list.params.search_values : null
                })
            },
            {
                token: 'configListable',
                resolveFn: ()=> {
                    return {
                        url: apiBase,
                        top: {
                            search: searchBy,
                            buttons: genButtons(list.buttonsTop || ['new'], collection)
                        },
                        params: list.params,
                        items: {
                            actions: genButtons(['edit','delete'], collection),
                            fields: list.fields,
                            collection: collection,
                            only: list.only
                        }
                    }
                }
            }
        ]
    },{
        name: stateBase+'.new',
        url: '/new',
        views: viewsC,
        resolve: [
            {
                token: 'configFormidable',
                resolveFn: ()=>{
                    return {
                        title: titles.create,
                        size: create.modalSize,
                        inModal: create && create.inModal,
                        sections: sectionsForm(create.sections),
                        saveTo: apiBase,
                        onSave: create.onSave,
                        model: model
                    }
                }
            }
        ]
    },{
        name: stateBase+'.edit',
        url: '/edit/:'+collection+'Id',
        views: viewsE,
        resolve: [
            {
                token: 'configFormidable',
                resolveFn: ()=>{
                    return {
                        title: titles.edit,
                        size: edit && edit.modalSize || create.modalSize,
                        inModal: !edit ? create.inModal : edit && edit.inModal ? true : null,
                        sections: sectionsForm(edit && edit.sections || create.sections),
                        idParam: collection+'Id',
                        saveTo: apiBase,
                        getModel: edit && edit.getModel ? edit.getModel : null,
                        onSave: edit && edit.onSave ? edit.onSave : null,
                        model: model
                    }
                }
            }
        ]
    })
}
