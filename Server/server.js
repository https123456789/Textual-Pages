var express = require("express");
var cors = require("cors");
var fs = require("fs");
var app = express();
app.use(cors());
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

app.get("/resreq", function(req, res) {
	var data = fs.readFileSync(req.query.path, "utf-8");
	res.write(data);
	res.end();
});

app.get("/documentation", function(req, res) {
	res.render("docs", {
		title: "Docs",
		pageTitle: "Docs"
	});
});

app.get("/documentation/api", function(req, res) {
	res.render("docs\\api", {
		title: "Docs - API",
		pageTitle: "Docs - API"
	});
});

app.get("/patches", function(req, res) {
	res.render("patches", {
		title: "Patches",
		pageTitle: "Patches"
	});
});

app.get("/api", function(req, res) {
	var ip = req.socket.remoteAddress;
	if (req.headers["x-forwarded-for"] != "") {
		ip = req.headers["x-forwarded-for"];
	}
	console.log(req.headers);
	// Check if ip has passed limit
	var reqsDataRaw = fs.readFileSync("../res/api/reqs.json", "utf-8");
	var reqsData = JSON.parse(reqsDataRaw);
	//reqsData["Limit"] -= 1;
	var objRefId = "undef";
	for (var i = 0; i < reqsData.IPS.length; i++) {
		console.log(reqsData.IPS[i].ipAddr);
		console.log(ip);
		if (reqsData.IPS[i].ipAddr == ip) {
			objRefId = i;
		}
		console.log(objRefId);
	}
	if (objRefId == "undef") {
		reqsData.IPS.push({
			ipAddr: ip
		});
	}
	fs.writeFileSync("../res/api/reqs.json", JSON.stringify(reqsData));
	// Proccess request
	var method = req.query.m;
	var resourceType = req.query.rt;
	if (method == "get") {
		if (resourceType == "file") {
			var fileName = "../res/" + req.query.fn;
			var fileExists = fs.existsSync(fileName);
			if (fileExists) {
				var data = fs.readFileSync(fileName, "utf-8");
			} else {
				var data = fs.readFileSync("../res/api/nf.json", "utf-8")
			}
			res.writeHead(200, {
				"Content-type": "application/json"
			});
			res.write(data);
			res.end();
		} else if (resourceType == "patch") {
			var fileName = "../res/textual/patches/" + req.query.fn;
			var fileExists = fs.existsSync(fileName);
			if (fileExists) {
				var data = fs.readFileSync(fileName, "utf-8");
			} else {
				var data = fs.readFileSync("../res/api/nf.json", "utf-8");
			}
			if (req.query.pid) {
				data = JSON.parse(data);
				var reqD = data["Patches"][req.query.pid];
				res.writeHead(200, {
					"Content-type": "application/json"
				});
				res.write(JSON.stringify(reqD));
				res.end();
			} else {
				res.writeHead(200, {
					"Content-type": "application/json"
				});
				res.write(data);
				res.end();
			}
		} else {
			var data = fs.readFileSync("../res/api/nrtd.json", "utf-8");
			res.writeHead(200, {
				"Content-type": "application/json"
			});
			res.write(data);
			res.end();
		}
	} else {
		res.render("api", {
			title: "API",
			pageTitle: "API",
			error: ""
		});
	}
});

app.get("/patch", function(req, res) {
	var method = req.query.m;
	res.send("<p>" + method + "</p>");
});

app.get("/download", function(req, res) {
	res.render("download", {
		title: "Download Textual",
		pageTitle: "Download Textual"
	})
});

app.get("/extras", function(req, res) {
	res.render("extras", {
		title: "Extras",
		pageTitle: "Extras"
	});
})

app.use(function(re, res, next) {
	res.status(404);
	res.send("404: File Not Found");
});

app.listen(3000, () => {
	console.log("Listening on port 3000.");
});