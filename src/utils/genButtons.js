import _ from 'lodash'

export default function(buttons, collection){
    var btn = []
    _.forEach(buttons,(val,key)=>{
        if(typeof val == 'string'){
            switch(val){
                case 'new': 
                    btn.push({
                        label: 'new',
                        icon: 'add',
                        link: '.new',
                        props: {
                            primary: true
                        }
                    })
                break;
                case 'back': 
                    btn.push({
                        label: 'back',
                        link: '^',
                    })
                break;
                case 'close': 
                    btn.push({
                        label: 'close',
                        link: '^',
                    })
                break;
                case 'edit': 
                    var params = {}
                    params[collection+'Id'] = 'id'
                    btn.push({
                        icon: 'pencil',
                        link: '.edit',
                        edit: true,
                        params: params,
                        props: {
                            basic: true,
                            color: 'green'
                        }
                    })
                break;
                case 'delete': 
                    btn.push({
                        icon: 'trash',
                        delete: true,
                        props: {
                            basic: true,
                            color: 'red'
                        }
                    })
                break;
            }
        }
        else
            btn.push(val)
    })
    return btn
}
