'use strict'
var React = require('react')
var Hello = require('./ReactApp').ReactApp;

var Router = require("react-router");

var RouteHandler = Router.RouteHandler
	, Route = Router.Route
;

var Destination = React.createClass({
  render: function() {
    return <div>You made it!</div>;
  }
});

var routes = (
	<Route handler={Hello} path="/">
		<Route name="destination" path="destination" handler={Destination} />
	</Route>
)

Router.run(routes, Router.HistoryLocation, Handler => React.render(<Handler name="Terrence" />, document.getElementById("content")));

//React.render(<Hello name="Terrence" />, document.getElementById("content"));
