import React, { Component } from 'react'
import { Input } from 'semantic-ui-react'
import { http, http_async, catchErrors, triggers } from "utils"
var counterpart = require('counterpart');

export default class extends Component {

    constructor(props){
        super(props)
    }

    componentWillMount(){
        triggers.register('update',()=>this.forceUpdate())
    }

    render(){

        var translate = ''

        if(this.props.children)
            translate = counterpart(this.props.children, { fallback: this.props.children })

		return (
            <span>{translate}</span>
		)

    }

}
