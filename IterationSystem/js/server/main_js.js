function init() {
	$("#p_user").text(getUserName()) ;
	var iframe = $("#main_iframe");
	var currentiframe = getCurrentFrame();
	if((currentiframe == "null" || currentiframe == undefined || currentiframe == "") && ( iframe.attr("src") == undefined || iframe.attr("src") == "")) {
		console.log(currentiframe);
		iframe[0].src = "projectFrame.html";
	} else {
		console.log("aaa:"+currentiframe);
		iframe[0].src = currentiframe;
	}
	console.log("2222main_iframe："+currentiframe);
}

window.onbeforeunload = function() {
};