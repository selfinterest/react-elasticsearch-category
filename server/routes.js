var isProduction = process.env.NODE_ENV === "production"
	, port = isProduction ? process.env.PORT : 3000
	, httpProxy = require('http-proxy')
	, proxy = httpProxy.createProxyServer()
	, log = require("winston")
    , React = require("react/addons")
    , ReactApp = React.createFactory(require('../app/ReactApp.js').ReactApp)
    , Router = require("react-router")
;

//console.log(Router);
//import match from 'react-router/lib/Match';

import { RoutingContext, match } from 'react-router';
import createLocation from 'history/lib/createLocation';

//console.log(match);
var RouteHandler = Router.RouteHandler
	, Route = Router.Route
;

var Destination = React.createClass({
  render: function() {
    return <div>You made it!</div>;
  }
});

var destination = React.createFactory(Destination);

var routes = (
	<Route component={ReactApp} path="/">
		<Route name="destination" path="destination" component={destination} />
	</Route>
)

export default (app) => {
	// We only want to run the workflow when not in production
	if (!isProduction) {

	  log.verbose("Setting up proxy");

	  // We require the bundler inside the if block because
	  // it is only needed in a development environment. Later
	  // you will see why this is a good idea
	  var bundle = require('./bundle.js');
	  bundle();

	  // Any requests to localhost:3000/build is proxied
	  // to webpack-dev-server
	  app.all('/build/*', (req, res) => {
	    log.verbose("Proxying request");
	    proxy.web(req, res, {
	        target: 'http://localhost:8080'
	    });
	  });

	}

	app.get("/", (req, res) => {
	  var reactHtml = React.renderToString(ReactApp({name: "Terrence"}));

	  res.render('index.jade', {
	    reactOutput: reactHtml
	  })
	});

	app.get('*', function (req, res) { // This wildcard method handles all requests
		var reactHtml;
		let location = createLocation(req.url);
		console.log(match);
		match({ routes, location }, (error, redirectLocation, renderProps) => {
			//var Context = React.createElement(RoutingContext, renderProps);
			//console.log(Context);
			//var Context = React.createFactory(RoutingContext(renderProps));
			//reactHtml = React.renderToString(Context);
			var reactHtml = "";
			res.render('index.jade', {reactOutput: reactHtml});		
		});
    	/*Router.run(routes, req.path, function (Handler, state) {
    		console.log(Handler);
    		console.log(state);
        	var element = React.createElement(Handler, {name: "Terrence"});
        	var reactHtml = React.renderToString(element);
        	//var reactHtml = Handler({name: "Terrence"});
        	res.render('index.jade', { reactOutput: reactHtml });
    	});*/

	});

	// It is important to catch any errors from the proxy or the
	// server will crash. An example of this is connecting to the
	// server when webpack is bundling
	proxy.on('error', (e) => {
	  console.log('Could not connect to proxy, please try again...');
	  log.error(e);
	});

	// Set up server
	app.listen(port, () => { 
		log.info("Server running on port %s", port);
	});

	//Also set up React routes

}