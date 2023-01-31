import _ from 'lodash'

export default function(options, val, returnPath, container, withScope = true){
                
    var obj = _.clone(options)
    var selected = null
    var path = ""

    _.forEach(val, item => {

        if(path=="")
            path += (withScope ? 'this.' : '')+(container || 'options')

        _.forEach(obj, (model, key) => {
            if(item==model.value){

                path += '['+key+'].children'

                selected = _.clone(model)
                obj = model.children
            }
        })
    })

    // if(returnPath)
        // eval(path+' = setChildren')

    return returnPath ? path : selected

}