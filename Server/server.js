var express = require("express");
var fs = require("fs");
var app = express();
app.set("view engine", "vash");
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use("/bootstrap", express.static(__dirname + "/node_modules/bootstrap/dist"));
app.use("/static", express.static("static"));

app.get("/", function(req, res) {
	res.render("index", {
		title: "Home",
		pageTitle: "Home"
	});
});

app.get("/docs", function(req, res) {
	res.render("docs", {
		title: "Docs",
		pageTitle: "Docs"
	});
});

app.get("/patches", function(req, res) {
	res.render("patches", {
		title: "Patches",
		pageTitle: "Patches"
	});
});

app.get("/api", function(req, res) {
	var method = req.query.m;
	var resourceType = req.query.rt;
	if (method == "get") {
		if (resourceType == "file") {
			var fileName = req.query.fn;
			var data = fs.readFileSync(fileName, "utf-8");
			res.writeHead(200, {
				"Content-type": "application/json"
			});
			res.write(data);
			res.end();
		}
	} else {
		res.render("api", {
			title: "API",
			pageTitle: "API"
		});
	}
});

app.get("/patch", function(req, res) {
	var method = req.query.m;
	res.send("<p>" + method + "</p>");
});

app.listen(3000, () => {
	console.log("Listening on port 3000.");
});