import _ from 'lodash'

var data = {}

export default {
    register: function(name,func){
        if(!data[name])
            data[name] = []
        data[name].push(func)
    },
    call: name=>{
        if(data[name]){
            _.forEach(data[name],(val,key)=>val())
        }
    }
}
