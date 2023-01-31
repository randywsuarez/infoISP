import { http_ac, Storage, env, slug, toast } from './'
import 'babel-polyfill';
import _ from 'lodash'

const login = async ()=>{
	var ac = await http_ac({action: 'common-info'})
	Storage.set('cookieAc',ac.results.common.cookie)
	var login = await http_ac({action: 'login', login: env.acUser, password: env.acPassword})
	return Storage.get('cookieAc')
}

const getFolderId = async ()=>{
	var meet = await http_ac({
        action: 'sco-shortcuts',
    })
    var id = null
    _.forEach(meet.results.shortcuts.sco,val=>{
    	if(val['@type']=='my-meetings')
    		id = val['@sco-id']
    })
    return id

}

const getTemplateId = async ()=>{
	var meet = await http_ac({
        action: 'sco-shortcuts',
    })
    var id = null
    //console.log(meet)
    _.forEach(meet.results.shortcuts.sco,val=>{
    	if(val['@type']=='shared-meeting-templates')
    		id = val['@sco-id']
    })

    var meet = await http_ac({
    	action: 'sco-contents',
    	'sco-id': id
    })

    var id = meet.results.scos.sco[1]['@sco-id']

    //console.log(meet)

    return id
}

export default {
	login: login,
	getFolderId: getFolderId,
	getAulas: async ()=>{

		await login()

		var result = await http_ac({
			action: 'sco-contents',
			'filter-type': 'meeting',
			'sco-id': await getFolderId()
			// 'filter-expired': false
		})

		//console.log(result)

		return result.results.scos.sco.length ? result.results.scos.sco : [result.results.scos.sco]
	},
	deleteMeeting: async (id)=>{
		var result = await http_ac({
			action: 'sco-delete',
			'sco-id': id
		})

		return result
	},
	getMeeting: async (id)=>{
		var meet = await http_ac({
			action: ''
		})
	},
	crearAula: async (data) => {

		await login()

		var folderId = await getFolderId()
		var templateId = await getTemplateId()
		// return
		//console.log(templateId)
		var d = {
			action: 'sco-update',
			type: 'meeting',
			name: data.name,
			// 'principal-id': 'public-access',
			// 'permission-id': 'host',
			'date-begin': data.start,
			'date-end': data.end,
			// access: 'access-open'
			// 'url-path': slug(data.name),
			'source-sco-id': templateId
		}

		if(data.id)
			d['sco-id'] = data.id
		else
			d['folder-id'] = folderId

		var create = await http_ac(d)

		if(create.results.status['@code']=='invalid'){
			var msg = ''
			if(create.results.status.invalid['@field']=='name' && create.results.status.invalid['@subcode']=='duplicate')
				toast.error('El nombre ya existe...')

			// toast.error('Ha ocurrido un error')
			//console.log(create)

			create = null
		}

		if(!data.id){
			await http_ac({
				action: 'permissions-update',
				'principal-id': 'public-access',
				'permission-id': 'view-hidden',
				'acl-id': create.results.sco['@sco-id']
			})
		}

		return create
		//console.log()
	}
}