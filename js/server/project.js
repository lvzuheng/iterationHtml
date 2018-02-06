var userName;
var passWord;
var uri = connectUrl + "file/"
var projectArray = new Array;
var startIndex;
var size = 6;

function init() {
	if($.cookie("userName") == null || $.cookie("passWord") == null) {
		console.log("调回");
		parent.location.href = "Login.html";
		return;
	}
	userName = getUserName();
	passWord = getPassWord();
	loadProjectList(0);
	setCurrentFrame(window.location.href);
}

function loadProjectList(start) {
	var fileList = {
		"userName": userName,
		"passWord": $.md5(passWord)
	};
	$.ajax({
		url: uri + "Projectinfo",
		type: "post",
		data: {
			"request": JSON.stringify(fileList)
		},
		async: true,
		success: function(result) {
			console.log(JSON.parse(result));
			projectArray = JSON.parse(result);
			initProjectList(start);
			initIndexList();
		},
		error: function(result) {
			console.log(JSON.stringify(result));
			return null;
		}
	});
}

function initProjectList(start) {
	console.log(projectArray.length + "," + start);
	var ul_project = $("#ul_project");
	ul_project.html("");
	var readSize
	if(size > projectArray.length - start) {
		readSize = projectArray.length - start;
	} else {
		readSize = size;
	}
	for(var i = start; i < start + readSize; i++) {
		var li = createElemet("li", projectArray[i].projectname);
		li.setAttribute("value", projectArray[i].id);
		li.addEventListener('click', function() {
			setProjectId($(this).val());
			location.href = "file.html";
		});
		ul_project.append(li);

	}
	startIndex = start + size;
}

function initIndexList() {
	var ul_index = $("#ul_index");
	ul_index.html("");
	var index = Math.ceil(projectArray.length / size);
	for(var i = 0; i < index; i++) {
		var li = createElemet("li", null);
		li.setAttribute("value", i);
		li.appendChild(createElemet("a", i + 1))
		li.addEventListener('click', function() {
			console.log("li.val:" + ((startIndex / size)) + "," + $(this).val());
			if((startIndex / size) != ($(this).val() + 1)) {
				console.log("size:" + startIndex + "," + ($(this).val() * size) + "," + $(this).val());
				initProjectList($(this).val() * size);
			}

		});
		ul_index.append(li);
	}
}

function createElemet(element, value) {
	var em = document.createElement(element);
	if(value != null) {
		em.innerText = value;
	}
	return em;
}

function createProject() {

}

//添加项目功能
function createProject() {
	var dialog_add = dialog({
		title: '创建项目',
		content: $("#div_add"),
		width: "250px",
		okValue: '创建',
		ok: function() {
			button_add_event();
		},
		cancelValue: '取消',
		cancel: function() {},
		quickClose: true
	});
	dialog_add.show();
}

function button_add_event() {
	var loading = load_dialog("创建中");
	loading.show();
	if($("#input_add_projectName").val() != null && $("#input_add_projectAuthority").val() != null) {
		var jsondata = {
			"userName": userName,
			"passWord": $.md5(passWord),
			"projectName": $("#input_add_projectName").val(),
			"authority": $("#input_add_projectAuthority").val(),
		};
		$.ajax({
			url: uri + "createProject",
			type: "post",
			data: {
				"request": JSON.stringify(jsondata),
			},
			async: false,
			success: function(result) {
				loading.close();
				if(result != "0") {
					$("#input_add_projectName").val("");
					$("#input_add_projectAuthority").val("");
					loadProjectList(0);
					var info_d = info_dialog("创建成功");
					info_d.show();
					setTimeout(function() {
						info_d.close();
					}, 2000);
				} else {
					var info_d = info_dialog("创建失败");
					info_d.show();
					setTimeout(function() {
						info_d.close();
					}, 2000);
				}
			},
			error: function(result) {
				var info_d = info_dialog("创建失败");
				info_d.show();
				setTimeout(function() {
					info_d.close();
				}, 2000);
			}
		});
	}
}
