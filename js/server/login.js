var uri = connectUrl + "user/";
//var uri = "http://120.55.162.188:8080/MobileSystem/" + "login/";
function init() {
	$("#login_username").val(getUserName());
	$("#login_password").val(getPassWord());
	//		if($("#login_username").val()!=null && $("#login_password").val()!=null){
	//			login_event();
	//		}
	clearInfo();
}

function check_username_event() {
	var user_input = $("#login_username");
	if(user_input.val() != null) {
		var jsondata = {
			"userName": $("#login_username").val()
		};
		$.ajax({
			url: uri + "username",
			type: "post",
			data: {
				"request": JSON.stringify(jsondata)
			},
			async: true,
			success: function(result) {
				if(result == "0") {
					$("#login_username_tips")[0].style.visibility = "visible";
				} else {
					$("#login_username_tips")[0].style.visibility = "hidden";
				}
			},
			error: function(result) {
				return null;
			}
		});
	}

}

function login_event() {
	if($("#login_username_tips")[0].style.visibility == "visible") {
		return;
	}
	var data = {
		"userName": $("#login_username").val(),
		"password": $.md5($("#login_password").val())
	};
	console.log("aaaaa:" + uri);
	$.ajax({
		url: uri + "login",
		type: "post",
		data: {
			"request": JSON.stringify(data)
		},
		async: true,
		success: function(result) {
			
			if(result == "0") {
				$("#login_password_tips")[0].style.visibility = "visible";
			} else {
				setUserName($("#login_username").val());
				setPassWord( $("#login_password").val());
				clearInfo();
				location.href = "Main.html";
			}
		},
		error: function(result) {
			console.log(result);
			return null;
		}
	});
}