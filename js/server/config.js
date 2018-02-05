//var ip = "120.55.162.188";
var ip = "10.20.175.146";
var port = "9060";
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
	return $.cookie("projectId");

}

function setCurrentFrame(saveframe) {
	$.cookie("iframe", saveframe, {
		path: "/"
	});
}

function getCurrentFrame() {
	return $.cookie("iframe");
}

function clearInfo() {
		$.cookie("iframe", null);
		$.cookie("projectId", null);
}