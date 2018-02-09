//var ip = "120.55.162.188";
var ip = "120.55.162.188";
var port = "8080";
var connectUrl = "http://" + ip + ":" + port + "/iteration/";

function setUserName(userName) {
	$.cookie("userName", userName, {
		path: "/"
	});
}

function getUserName(userName) {
	return $.cookie("userName");
}

function setPassWord(passWord) {
	$.cookie("passWord", passWord, {
		path: "/"
	});
}

function getPassWord(passWord) {
	return $.cookie("passWord");
}

function setProjectId(saveprojectId) {
	$.cookie("projectId", saveprojectId, {
		path: "/"
	});

}

function getProjectId() {
	return $.cookie().projectId;
}

function setCurrentFrame(saveframe) {
	$.cookie("iframe", saveframe, {
		path: "/"
	});
	console.log("$.cookie(iframe):" + $.cookie().iframe);
}

function getCurrentFrame() {
	return $.cookie().iframe;
}

function clearInfo() {
	$.cookie("iframe",null, {
		path: "/"
	});
	$.cookie("projectId", null, {
		path: "/"
	});
}