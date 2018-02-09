var uri = connectUrl + "file/";
var user;
var pWord;
var startindex;
var size = 6;
var projectArray;
var selectProjectId;

function init() {
	if($.cookie("userName") == null || $.cookie("passWord") == null) {
		console.log("调回");
		return;
	}
	user = getUserName();
	pWord = getPassWord();
	selectProjectId = getProjectId();
	loadProject();
	setCurrentFrame(window.location.href);
}

function loadProject() {
	var fileList = {
		"userName": user,
		"passWord": $.md5(pWord)
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
			console.log("selectProjectId:" + selectProjectId + "," + (selectProjectId == null));
			inter:
			if(selectProjectId == null) {
				selectProjectId = projectArray[0].id;
				console.log("selectProjectId:" + selectProjectId);
			} else {
				for(var i = 0; i < projectArray.length; i++) {
					if(projectArray[i].id == selectProjectId) {
						console.log("selectProjectId:" + (projectArray[i].id + "，" + selectProjectId));
						break inter;
					}
				}
				console.log("selectProjectId:出来了");
				selectProjectId = projectArray[0].id;
			}
			
			console.log("selectProjectId:" + selectProjectId + "," + (selectProjectId == null));
			initProject(projectArray, selectProjectId);
		},
		error: function(result) {
			console.log(JSON.stringify(result));
			return null;
		}
	});
}

function initProject(projects, projectId) {
	var ul_index = $("#ul_project");
	ul_index.html("");
	selectProjectId = projectId;

	if(projectArray != null && projectArray.length > 0) {
		for(var i = 0; i < projectArray.length; i++) {
			if(projectArray[i].id == projectId) {
				var data = projectArray[i];
				projectArray.splice(i, 1);
				projectArray.splice(0, 0, data);
			}
		}
		console.log("ul_project:" + projectArray[0].id + "," + projectArray[0].projectname);
		var width = 0;
		var li_more;
		var ul_more;
		for(var i = 0; i < projects.length; i++) {
			var li = createElemet("li", null);
			var a = createElemet("a", projects[i].projectname)
			a.setAttribute("href", "#");
			a.setAttribute("data-toggle", "tab");
			li.appendChild(a);
			li.setAttribute("value", projects[i].id);
			if(width < document.body.clientWidth - 250) {
				li.addEventListener("click", function() {
					selectProjectId = $(this).val();
					loadFileList($(this).val());
					setProjectId(selectProjectId);
				});
				ul_index.append(li);
				width = li.offsetWidth + width;
			} else {
				if(li_more == null) {
					li_more = createElemet("li", null);
					$(li_more).addClass("dropdown");
					var a = createElemet("a", "more");
					a.setAttribute("data-toggle", "dropdown");
					a.setAttribute("href", "#");
					var b = createElemet("b", null);
					$(b).addClass("caret");
					a.appendChild(b)
					li_more.appendChild(a);
					ul_more = createElemet("ul", null);
					ul_more.appendChild(li);
					$(ul_more).addClass("dropdown-menu");
					li_more.appendChild(ul_more);
					ul_index.append(li_more);
				}
				li.addEventListener("click", function() {
					initProject(projectArray, $(this).val());
					loadFileList($(this).val());
					setProjectId(selectProjectId);
				});
				ul_more.appendChild(li);
			}
		}
		ul_index.children().eq(0).toggleClass("active");
		//	console.log("active:" + ul_index.children().eq(0).attr("class"));
		loadFileList(projectArray[0].id);
		//	console.log("ul:" + $("#ul_project").children().eq(0).val());
	}

}

function loadFileList(projectId) {
	//	console.log("aaa:" + projectId);
	var fileList = {
		"userName": user,
		"passWord": $.md5(pWord),
		"projectId": projectId
	};
	console.log("request" + JSON.stringify(fileList));
	$.ajax({
		url: uri + "Productinfo",
		type: "post",
		data: {
			"request": JSON.stringify(fileList)
		},
		async: true,
		success: function(result) {
			//			console.log(JSON.parse(result));
			productArray = JSON.parse(result);
			initFlieList(JSON.parse(result));
		},
		error: function(result) {
			//			console.log(JSON.stringify(result));
			return null;
		}
	});
}

function initFlieList(data) {
	$('#table_file tr').eq(0).nextAll().remove();
	//	console.log("initFlieList:" + JSON.stringify(data));
	for(var i = 0; i < data.length; i++) {
		var tr = createElemet("tr");
		var td = createElemet("td", null);
		td.setAttribute("style", "text-align:center");
		var checkBox = document.createElement("input");
		checkBox.setAttribute("type", "checkbox");
		checkBox.setAttribute("value", data[i].id);
		checkBox.addEventListener('click', function(e) {
			e.stopPropagation();
		});
		td.appendChild(checkBox)
		tr.appendChild(td);
		tr.appendChild(createElemet("td", data[i].productname));
		tr.appendChild(createElemet("td", data[i].packname));
		tr.appendChild(createElemet("td", data[i].versionname));
		tr.appendChild(createElemet("td", data[i].authority));
		tr.appendChild(createElemet("td", data[i].condition));
		tr.appendChild(createElemet("td", data[i].uploadtime));
		tr.appendChild(createElemet("td", data[i].packagesize));
		tr.addEventListener('click', function() {
			if($(this).find("input").prop("checked")) {
				$(this).find("input").prop("checked", false);
			} else {
				$(this).find("input").prop("checked", true);
			}
		});
		$('#table_file').append(tr);
	}
}

function createElemet(element, value) {
	var em = document.createElement(element);
	if(value != null) {
		em.innerText = value;
	}
	return em;
}

function uploadFile() {
	importFile();
}

function importFile() {
	var selectedFile = document.getElementById("files").files[0]; //获取读取的File对象
	if(selectedFile != null) {
		var name = selectedFile.name; //读取选中文件的文件名
		var size = selectedFile.size; //读取选中文件的大小
		console.log("文件名:" + name + "大小：" + size);
		var reader = new FileReader(); //这里是核心！！！读取操作就是由它完成的。
		reader.readAsDataURL(selectedFile); //读取文件的内容
		reader.onload = function() {
			console.log(this.result); //当读取完成之后会回调这个函数，然后此时文件的内容存储到了result中。直接操作即可。
			upload(name, size, this.result);
		};
	}
}

function upload(filename, filesize, dataURL) {
	var loading = load_dialog("上传中，请耐心等待");
	loading.show();
	var projectId = selectProjectId;
	var fd = new FormData();
	var blob = dataURItoBlob(dataURL);
	console.log(+$("#ul_project").children().eq(0).val());
	fd.append("userName", user);
	fd.append("passWord", $.md5(pWord));
	fd.append("projectId", projectId);
	fd.append("fileName", filename);
	fd.append("fileSize", filesize);
	fd.append("fileData", blob);
	$.ajax({
		url: uri + "upload",
		type: "post",
		data: fd,
		async: true,
		processData: false, // tell jQuery not to process the data 
		contentType: false, // tell jQuery not to set contentType 
		success: function(data) {
			//			console.log(data);
			if(data == 1) {
				loadFileList(projectId);
				loading.close();
				showInfoDialog("上传成功", 1000);
			} else {
				loading.close();
				showInfoDialog("上传失败", 1000);
			}
		},
		error: function(result) {
			loading.close();
			showInfoDialog("上传失败，请验证文件信息", 1000);
			console.log(JSON.stringify(result));
			return null;
		}
	});
}

function dataURItoBlob(dataURI) {
	var byteString = atob(dataURI.split(',')[1]);
	var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
	var ab = new ArrayBuffer(byteString.length);
	var ia = new Uint8Array(ab);
	for(var i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i);
	}
	return new Blob([ab], {
		type: mimeString
	});
}

function deleteFile() {
	var loading = load_dialog("删除中，请耐心等待");
	loading.show();
	var projectId = selectProjectId;
	var checkBoxs = $("#table_file :checkbox");
	var fileArray = new Array()
	for(var i = 0; i < checkBoxs.length; i++) {
		if(checkBoxs.eq(i).prop("checked")) {
			//			console.log(checkBoxs.eq(i).val());
			fileArray[fileArray.length] = checkBoxs.eq(i).val();
		}
	}
	if(fileArray == null || fileArray.length == 0) {
		loading.close();
		showInfoDialog("没有选择文件", 1000);
		return;
	}
	var fileDelete = {
		"userName": user,
		"passWord": $.md5(pWord),
		"productId": fileArray
	};
	console.log(JSON.stringify(fileDelete));
	$.ajax({
		url: uri + "delete",
		type: "post",
		data: {
			"request": JSON.stringify(fileDelete)
		},
		async: true,
		success: function(result) {
			if(result == 1) {
				loadFileList(projectId);
				loading.close();
				showInfoDialog("删除成功", 1000);
			} else {
				loading.close();
				showInfoDialog("删除失败，请重新尝试", 1000);
			}
		},
		error: function(result) {
			loading.close();
			showInfoDialog("删除失败，请验证信息", 1000);
			//			console.log(JSON.stringify(result));
			return null;
		}
	});
}

// 编辑功能
function projectSetting() {
	if(projectArray != null && projectArray.length > 0) {
		for(var i = 0; i < projectArray.length; i++) {
			console.log("cccccc:" + selectProjectId + "," + projectArray[i].id);
			if(projectArray[i].id == selectProjectId) {
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
						saveProject();
					}
				},
				{
					value: "删除项目",
					callback: function() {
						deleteRequest();
					}
				}
			],
			quickClose: true
		});
		dialog_edit.show();
	}

}

function saveProject() {
	var loading = load_dialog("更新设置中，请耐心等待");
	loading.show();
	if($("#input_editor_projectName").val() != null && $("#input_editor_projectAuthory").val() != null) {
		var updateProject = {
			"userName": user,
			"passWord": $.md5(pWord),
			"projectId": selectProjectId,
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
					loadProject();
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

function deleteRequest() {
	if(productArray != null && productArray.length > 0) {
		console.log("提醒");
		var dialog_add = dialog({
			title: '提醒',
			content: "项目库中存在文件,删除项目同时会删除库中文件，是否继续？",
			width: "250px",
			okValue: '删除',
			ok: function() {
				removeProject();
			},
			cancelValue: '取消',
			cancel: function() {},
			quickClose: true
		});
		dialog_add.show();
	} else {
		removeProject();
	}
}

function removeProject() {
	var loading = load_dialog("删除中，请耐心等待");
	loading.show();
	var projectId = selectProjectId;
	var removeProject = {
		"userName": user,
		"passWord": $.md5(pWord),
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
				loadProject();
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