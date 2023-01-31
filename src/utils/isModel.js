import { findObj } from './'

export default function(options, val){
    var obj = findObj(options, val)
    return obj.model ? true : false
}