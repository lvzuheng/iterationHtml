var userName;
var passWord;
var uri = connectUrl + "file/"
var projectArray = new Array;
var startIndex;
var endIndex;
var size = 9;
var isProjectControllering = false;

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
	startIndex = start;
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
		//
		//		var li = createElemet("li", projectArray[i].projectname);
		//		li.setAttribute("value", projectArray[i].id);
		//		li.addEventListener('click', function() {
		//			setProjectId($(this).val());
		//			location.href = "file.html";
		//		});
		var li = creatProjectSquare(projectArray[i]);
		$(li).addClass(" col-lg-4 col-sm-4 col-xs-4 col-md-4");
		li.style.height = (ul_project[0].offsetHeight / 3) + "px";
		ul_project.append(li);
		console.log("li.offsetWidth:" + ul_project[0].offsetWidth / 4);
		console.log("ul_project.offsetWidth:" + ul_project[0].offsetWidth);
	}

	endIndex = start + size;
}

function creatProjectSquare(project) {
	var div = createElemet("div", null);
	var pName = createElemet("p", project.projectname);
	pName.style.fontSize = "30px";
	var pAu = createElemet("p", project.authority == 1 ? "公开" : "私有");
	div.appendChild(pName);
	div.appendChild(pAu);
	if(!isProjectControllering) {
		div.addEventListener('click', function() {
			setProjectId($(this).val());
			location.href = "file.html";
		});
	} else {
		div.addEventListener('click', function() {
			projectSetting(project.id);
		});
		$(div).addClass("project-progressing project-controller");
	}
	$(div).addClass(" div_li_project img-thumbnail ");
	var li = createElemet("li", null);
	li.setAttribute("value", project.id);
	li.style.padding = "10px";
	li.appendChild(div);
	return li;
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
			console.log("li.val:" + ((endIndex / size)) + "," + $(this).val());
			if((endIndex / size) != ($(this).val() + 1)) {
				console.log("size:" + endIndex + "," + ($(this).val() * size) + "," + $(this).val());
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
					$("#input_add_projectAuthority option[0]").attr("selected", "selected");
					//					$("#input_add_projectAuthority").val("");
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

// 编辑功能
function projectSetting(projectId) {
	if(projectArray != null && projectArray.length > 0) {
		for(var i = 0; i < projectArray.length; i++) {
			if(projectArray[i].id == projectId) {
				console.log("cccccc:" + projectArray[i].projectname);
				$("#input_editor_projectName").val(projectArray[i].projectname);
				$("#input_add_projectAuthority option[value=" + 1 + "]").attr("selected", "selected");
			}
		}
		var dialog_edit = dialog({
			title: '项目设置',
			content: $("#div_editor"),
			width: "250px",
			button: [{
					value: '取消',
					callback: function() {
						//					dialog_edit.close();
					}
				},
				{
					value: '保存',
					callback: function() {
						saveProject(projectId);
					}
				},
				{
					value: "删除项目",
					callback: function() {
						deleteRequest(projectId);
					}
				}
			],
			quickClose: true
		});
		dialog_edit.show();
	}

}

function saveProject(projectId) {
	var loading = load_dialog("更新设置中，请耐心等待");
	loading.show();
	if($("#input_editor_projectName").val() != null && $("#input_editor_projectAuthory").val() != null) {
		var updateProject = {
			"userName": userName,
			"passWord": $.md5(passWord),
			"projectId": projectId,
			"projectName": $("#input_editor_projectName").val(),
			"authority": $("#input_editor_projectAuthory").val()
		};
		$.ajax({
			url: uri + "updateProject",
			type: "post",
			data: {
				"request": JSON.stringify(updateProject)
			},
			async: true,
			success: function(result) {
				if(result != 0) {
					var p = JSON.parse(result);
					//					for(var i = 0; i < projectArray.length; i++) {
					//						if(projectArray[i].id == p.id) {
					//							projectArray[i] = p;
					//						}
					//					}
					loadProjectList(0);
					loading.close();
					showInfoDialog("更新成功", 1000);
				} else {
					loading.close();
					showInfoDialog("更新失败，请重新尝试", 1000);
				}
			},
			error: function(result) {
				loading.close();
				showInfoDialog("更新失败，请验证信息", 1000);
				console.log(JSON.stringify(result));
				return null;
			}
		});
	}
}

function deleteRequest(projectId) {
	var dialog_add = dialog({
		title: '提醒',
		content: "如果项目库中存在文件,删除项目同时会删除库中文件，是否继续？",
		width: "250px",
		okValue: '删除',
		ok: function() {
			removeProject(projectId);
		},
		cancelValue: '取消',
		cancel: function() {},
		quickClose: true
	});
	dialog_add.show();
}

function removeProject(projectId) {
	var loading = load_dialog("删除中，请耐心等待");
	loading.show();
	var removeProject = {
		"userName": userName,
		"passWord": $.md5(passWord),
		"projectId": projectId
	};
	console.log(JSON.stringify(removeProject));
	$.ajax({
		url: uri + "removeProject",
		type: "post",
		data: {
			"request": JSON.stringify(removeProject)
		},
		async: true,
		success: function(result) {
			if(result == 1) {
				loadProjectList(0);
				loading.close();
				showInfoDialog("删除成功", 1000);
			} else {
				loading.close();
				showInfoDialog("删除失败，请重新尝试", 1000);
			}
		},
		error: function(result) {
			showInfoDialog("删除失败，请验证信息", 1000);
			console.log(JSON.stringify(result));
			return null;
		}
	});
}

function projectController() {
	isProjectControllering = !isProjectControllering;
	$("#setting").val(isProjectControllering?" 完成 ":"项目管理");
	initProjectList(startIndex);
	//	$("#ul_project div").addClass("project-controller project-progressing");
	//	$("#ul_project div")
	//	$("#ul_project div").addClass()
}