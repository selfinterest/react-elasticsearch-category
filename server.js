require("babel/register");

var express = require("express")
	, path = require("path")
	, app = express()
	, publicPath = path.resolve(__dirname, "public")
  , nodeModules = path.resolve(__dirname, "node_modules")
	, log = require("winston")
  , routes = require("./server/routes") 
;

app.set("views", path.resolve(__dirname, "app"));
app.set("view engine", "jade");
log.level = "verbose";

// Set up static assets
app.use(express.static(publicPath));
app.use("/node_modules", express.static(nodeModules));

//Finish setting up server.
routes(app);

