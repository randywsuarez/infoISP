import _ from 'lodash'

export default function(data){
	var d = {}
    _.forEach(data,(val,key)=>{
    	if(val)
    		d[key] = val
    })
    return d
}
