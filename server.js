
// JSX transpiler
require("node-jsx").install();

var express = require("express")
	, path = require("path")
	, app = express()
	, isProduction = process.env.NODE_ENV === "production"
	, port = isProduction ? process.env.PORT : 3000
	, publicPath = path.resolve(__dirname, "public")
  , nodeModules = path.resolve(__dirname, "node_modules")
	, log = require("winston") 
	, httpProxy = require('http-proxy')
	, proxy = httpProxy.createProxyServer()
  , React = require("react")
  , ReactApp = React.createFactory(require('./app/ReactApp.jsx').ReactApp);
;

app.set("views", path.resolve(__dirname, "app"));
app.set("view engine", "jade");
log.level = "verbose";


// Set up static assets
app.use(express.static(publicPath));

app.use("/node_modules", express.static(nodeModules));

// We only want to run the workflow when not in production
if (!isProduction) {

  log.verbose("Setting up proxy");

  // We require the bundler inside the if block because
  // it is only needed in a development environment. Later
  // you will see why this is a good idea
  var bundle = require('./server/bundle.js');
  bundle();

  // Any requests to localhost:3000/build is proxied
  // to webpack-dev-server
  app.all('/build/*', function (req, res) {
    log.verbose("Proxying request");
    proxy.web(req, res, {
        target: 'http://localhost:8080'
    });
  });

}

app.get("/", function(req, res){
  var reactHtml = React.renderToString(ReactApp({}));
  console.log(reactHtml);
  res.render('index.jade', {
    reactOutput: reactHtml
  })
});

// It is important to catch any errors from the proxy or the
// server will crash. An example of this is connecting to the
// server when webpack is bundling
proxy.on('error', function(e) {
  console.log('Could not connect to proxy, please try again...');
  log.error(e);
});

// Set up server
app.listen(port, function(){ 
	log.info("Server running on port %s", port);
});
