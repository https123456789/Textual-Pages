function loadPatches() {
	var req = new XMLHttpRequest();
	req.open("GET", "/api?m=get&rt=file&fn=../patches.json", false);
	req.send();
	setTimeout(function() {
		document.getElementById("contentDiv").innerHTML = req.responseText;
	}, 1000);
}