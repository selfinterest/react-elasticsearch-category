'use strict'
var React = require('react')
var Nav = require("./nav/nav")
module.exports.ReactApp = React.createClass({
    displayName: 'HelloReact',
    render: function(){
        return <div>
        			<Nav/>
        			<div className="container">
	        			<div className="row">
	        				<div className="col-lg-12">
	        					<h1>Hello { this.props.name }</h1>
	    					</div>
	    				</div>
    				</div>
        		</div> 
        	
    }
})