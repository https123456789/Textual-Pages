function loadPatches() {
	var req = new XMLHttpRequest();
	req.open("GET", "/resreq?path=../res/textual/patches/patches.json", false);
	req.send();
	setTimeout(function() {
		document.getElementById("contentDiv").innerHTML = req.responseText;
	}, 1000);
}