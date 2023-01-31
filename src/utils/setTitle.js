var counterpart = require('counterpart');
import { globals } from './'

export default function(title){

	var t = title
	globals.lastTitle = globals.currentTitle

	if(!t)
		t = globals.lastTitle

	document.title = 'Skill2u | '+counterpart(t,{fallback: t})
	globals.currentTitle = t

}
