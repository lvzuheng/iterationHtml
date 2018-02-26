var uri = connectUrl + "file/";
var user;
var pWord;
var startindex;
var size = 6;
var projectArray;
var selectProjectId;
var uploadProductId;
var isProductControllering = false;
var publicLoading;

function init() {
	if($.cookie("userName") == null || $.cookie("passWord") == null) {
		return;
	}
	user = getUserName();
	pWord = getPassWord();
	selectProjectId = getProjectId();
	loadProject();
	setCurrentFrame(window.location.href);
	window.onblur = function() {
		if(publicLoading!=null){
			publicLoading.close();
			
			
			
		}
	};
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
		var product = data[i];
		console.log(data[i].productname);
		(function(productInfo) {
			console.log(productInfo.id);
			var tr = createElemet("tr");
			//		var td = createElemet("td", null);
			//		td.setAttribute("style", "text-align:center");
			//		var checkBox = document.createElement("input");
			//		checkBox.setAttribute("type", "checkbox");
			//		checkBox.setAttribute("value", data[i].id);
			//		checkBox.addEventListener('click', function(e) {
			//			e.stopPropagation();
			//		});
			//		td.appendChild(checkBox)
			//		tr.appendChild(td);
			tr.appendChild(createElemet("td", productInfo.productname));
			//		tr.appendChild(createElemet("td", data[i].packname));
			//		tr.appendChild(createElemet("td", data[i].versionname));
			tr.appendChild(createElemet("td", productInfo.authority == 0 ? "私有" : "公开"));
			tr.appendChild(createElemet("td", productInfo.createtime));
			//		tr.appendChild(createElemet("td", data[i].condition));
			//		tr.appendChild(createElemet("td", data[i].uploadtime));
			//		tr.appendChild(createElemet("td", data[i].packagesize));
			//		var product = data[i];
			tr.value = productInfo.id;
			tr.addEventListener('click', function() {
				showFileDetiles(productInfo)
			}, false);
			$('#table_file').append(tr);
			$(tr).find("td").css("line-height", tr.offsetHeight + "px");
		})(data[i]);
	}
}

function createElemet(element, value) {
	var em = document.createElement(element);
	if(value != null) {
		em.innerText = value;
	}
	return em;
}

//function uploadFile() {
//	importFile();
//}
function open() {
	console.log("open");
}

function importFile() {
	console.log("文件名:---------------------");
	publicLoading.close();
	var selectedFile = document.getElementById("files").files[0]; //获取读取的File对象
	if(selectedFile != null) {
		var name = selectedFile.name; //读取选中文件的文件名
		var size = selectedFile.size; //读取选中文件的大小
		console.log("文件名:" + name + "大小：" + size);
		var reader = new FileReader(); //这里是核心！！！读取操作就是由它完成的。

		reader.readAsDataURL(selectedFile); //读取文件的内容
		reader.onload = function() {
			console.log("文件名::::" + this.result); //当读取完成之后会回调这个函数，然后此时文件的内容存储到了result中。直接操作即可。
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
	fd.append("productId", uploadProductId);
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

function deleteFileRequest(productId, productName, productAut) {
	$("#input_delete_productName").val(productName);
	$("#input_delete_productAuthory").val(productAut);
	var dialog_edit = dialog({
		title: '删除应用',
		content: $("#div_delete"),
		width: "250px",
		button: [{
				value: '取消',
				callback: function() {
					//					dialog_edit.close();
				}
			},
			{
				value: '删除(将不可恢复)',
				callback: function() {
					creatProduct_event();
				}
			}

		],
		quickClose: true
	});
	dialog_edit.show();
}

function deleteFile(projectId) {
	var loading = load_dialog("删除中，请耐心等待");
	loading.show();
	var fileDelete = {
		"userName": user,
		"passWord": $.md5(pWord),
		"productId": projectId
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

function createProduct() {
	var dialog_edit = dialog({
		title: '创建应用',
		content: $("#div_create"),
		width: "250px",
		button: [{
				value: '取消',
				callback: function() {
					//					dialog_edit.close();
				}
			},
			{
				value: '创建',
				callback: function() {
					creatProduct_event();
				}
			}

		],
		quickClose: true
	});
	dialog_edit.show();
}

function creatProduct_event() {
	if($("#input_create_productName").val() != null && $("#input_create_productAuthory").val() != null) {
		var loading = load_dialog("创建中，请耐心等待");
		loading.show();
		var projectId = selectProjectId;
		var createProduct = {
			"userName": user,
			"passWord": $.md5(pWord),
			"productName": $("#input_create_productName").val(),
			"authority": $("#input_create_productAuthory").val(),
			"projectId": projectId
		};
		$.ajax({
			url: uri + "createProduct",
			type: "post",
			data: {
				"request": JSON.stringify(createProduct)
			},
			async: true,
			success: function(result) {
				if(result == 1) {
					loadProject();
					loading.close();
					showInfoDialog("创建成功", 1000);
				} else {
					loading.close();
					showInfoDialog("创建失败，请重新尝试", 1000);
				}
			},
			error: function(result) {
				showInfoDialog("创建失败，请验证信息", 1000);
				console.log(JSON.stringify(result));
				return null;
			}
		});
	}
}

function showFileDetiles(productInfo) {
	$("#font_productName").text("");
	$("#font_createTime").text("");
	$("#font_authority").text("");
	$("#font_packname").text("");
	$("#font_uploadTime").text("");
	$("#font_versionName").text("");
	$("#font_versionCode").text("");
	$("#font_fileSize").text("");
	$("#font_condition").text("");
	console.log("addEventListener:" + productInfo.id);
	if(productInfo != null) {
		$("#font_productName").text(productInfo.productname);
		$("#font_createTime").text(productInfo.createtime);
		$("#font_authority").text(productInfo.authority == 0 ? "私有" : "公开");
		$("#font_packname").text(productInfo.packname);
		$("#font_uploadTime").text(productInfo.uploadtime);
		$("#font_versionName").text(productInfo.versionname);
		$("#font_versionCode").text(productInfo.versioncode);
		$("#font_fileSize").text(productInfo.packagesize);
		$("#font_condition").text(productInfo.condition);
	}
	console.log("   " + $("#font_productName").val());
	uploadProductId = productInfo.id;
	var width = document.body.clientWidth * 0.8;
	if(width > 800) {
		width = 800;
	} else if(width < 600) {
		width = 600;
	}
	var dialog_edit = dialog({
		title: '详细信息',
		content: $("#div_details"),
		width: width,
		button: [{
			value: '上传应用',
			callback: function() {
				uploadProductId = productInfo.id;
				publicLoading = load_dialog("正在读取本地文件路径，请耐心等待")
				publicLoading.show();
				$("#files").click();

			}
		}, ],
		quickClose: true
	});
	dialog_edit.show();
}

function productSetting() {
	isProductControllering = !isProductControllering;
	$("#setting").val(isProductControllering ? "完成" : "应用管理");
	$("#td_product_controller").css("display", isProductControllering ? "table-cell" : "none");
	if(isProductControllering) {
		var trs = $("#table_file").find("tr");
		for(var i = 0; i < trs.length; i++) {
			(function(product_tr) {
				var button = createElemet("input");
				button.setAttribute("type", "button");
				button.value = "X";
				$(button).addClass("circle-btn");
				button.addEventListener("click", function(e) {
					deleteFileRequest(product_tr.val(), $(product_tr).find("td").eq(0).text(), $(product_tr).find("td").eq(1).text())
					e.stopPropagation();
				})
				$(trs[i]).find("td").eq(0).append(button);
			})($(trs[i]))
		}
	} else {
		$("#table_file input[type='button']").remove();
	}

}