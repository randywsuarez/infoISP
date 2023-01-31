import _ from 'lodash'
import { env } from "utils";

export default function(src){
    return src ? env.baseUrl+src : null
}
