var uri = connectUrl + "file/";
var user = 'lzh';
var pWord = '123456';
var startindex;
var size = 6;
var projectArray;
var productArray;

function init() {
	//	if($.cookie("userName") == null || $.cookie("passWord") == null) {
	//		console.log("调回");
	//		return;
	//	}
	//	user = $.cookie("userName");
	//	pWord = $.cookie("passWord");
	loadProject();
}

function loadProject() {
	var fileList = {
		"userName": user,
		"passWord": $.md5(pWord)
	};
	$.ajax({
		url: uri + "Projectinfo",
		type: "get",
		data: {
			"request": JSON.stringify(fileList)
		},
		async: true,
		success: function(result) {
			console.log(JSON.parse(result));
			projectArray = JSON.parse(result);
			initProject(projectArray, 0);
		},
		error: function(result) {
			console.log(JSON.stringify(result));
			return null;
		}
	});
}

function initProject(projects, projectId) {

	for(var i = 0; i < projectArray.length; i++) {
		if(projectArray[i].id == projectId) {
			var data = projectArray[i];
			projectArray.splice(i, 1);
			projectArray.splice(0, 0, data);
		}
	}
	var ul_index = $("#ul_project");
	ul_index.html("");
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
					loadFileList($(this).val());
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
			});
			ul_more.appendChild(li);
		}
		ul_index.children().eq(0).toggleClass("active");
	}
	loadFileList(projectArray[0].id);
	console.log("ul:"+$("#ul_project").children().eq(0).val());
}

function loadFileList(projectId) {
	console.log("aaa:"+projectId);
	var fileList = {
		"userName": user,
		"passWord": $.md5(pWord),
		"projectId": projectId
	};
	console.log("request" + JSON.stringify(fileList));
	$.ajax({
		url: uri + "Productinfo",
		type: "get",
		data: {
			"request": JSON.stringify(fileList)
		},
		async: true,
		success: function(result) {
			console.log(JSON.parse(result));
			initFlieList(JSON.parse(result));
		},
		error: function(result) {
			console.log(JSON.stringify(result));
			return null;
		}
	});
}

function initFlieList(data) {
	console.log(JSON.stringify(data));
	$('#table_file').eq(0).nextAll().remove();
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
	var projectId = $("#ul_project").children().eq(0).val();
	var fd = new FormData();
	var blob = dataURItoBlob(dataURL);
	console.log(+$("#ul_project").children().eq(0).val());
	fd.append("userName", user);
	fd.append("passWord", $.md5(pWord));
	fd.append("projectId",projectId );
	fd.append("fileName", filename);
	fd.append("fileSize", filesize);
	fd.append("fileData", blob);
	$.ajax({
		url: uri + "upload",
		type: "POST",
		data: fd,
		async: true,
		processData: false, // tell jQuery not to process the data 
		contentType: false, // tell jQuery not to set contentType 
		//		xhr: function xhr() {
		//			//获取原生的xhr对象
		//			var xhr = new XMLHttpRequest;
		//			xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded;charset=UTF-8");  
		//			if(xhr.upload) {
		//				//添加 progress 事件监听
		//				xhr.upload.addEventListener('progress', function(e) {
		//					//已上传文件字节数/总字节数
		//					var percentage = parseInt(e.loaded / e.total * 100);
		//					console.log("time:"+percentage);
		//				}, false);
		//			}
		//			return xhr;
		//		},
		success: function(data) {
			console.log(data);
			if(data == 1) {
				alert("success");
				loadFileList(projectId);
			} else {
				alert("error");
			}
		},
		error: function(result) {
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
	var projectId = $("#ul_project").children().eq(0).val();
	var checkBoxs = $("#table_file :checkbox");
	var fileArray = new Array()
	for(var i = 0; i < checkBoxs.length; i++) {
		if(checkBoxs.eq(i).prop("checked")) {
			console.log(checkBoxs.eq(i).val());
			fileArray[fileArray.length] = checkBoxs.eq(i).val();
		}
	}
	var fileDelete = {
		"userName": user,
		"passWord": $.md5(pWord),
		"productId": fileArray,
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
				alert("删除成功");
			} else {
				alert("删除失败，请重新尝试");
			}
			loadFileList(projectId);
		},
		error: function(result) {
			console.log(JSON.stringify(result));
			return null;
		}
	});
}