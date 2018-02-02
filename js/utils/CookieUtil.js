
function setCookie(key,value){
		$.cookie(key,value);
}

function getCookie(){
	console.log("qwer"+document.cookie);
	var data = document.cookie.split(";");
	var dataArray = new Array();
	for(var i=0;i<data.length;i++){
		dataArray.push(data[i].split("=")[1]);
	}
	return dataArray;
}
