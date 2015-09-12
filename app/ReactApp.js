'use strict'
import { Router, Route, Link } from 'react-router';
import Nav from './nav/nav';

var React = require('react');


module.exports.ReactApp = React.createClass({
    displayName: 'HelloReact',
    render() {
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