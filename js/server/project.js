var userName;
var passWord;
var uri = connectUrl + "user/"

var projectArray = new Array;
var startIndex;
var size = 6;

function init() {
	if($.cookie("userName") == null || $.cookie("passWord") == null) {
		console.log("调回");
		parent.location.href = "Login.html";
		return;
	}
	userName = $.cookie("userName");
	passWord = $.cookie("passWord");
	loadProjectList(0, 6);
}

function loadProjectList(start) {
	var fileList = {
		"userName": userName,
		"passWord": $.md5(passWord)
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
	}else{
		readSize = size;
	}
	for(var i = start; i < start +readSize; i++) {
		var li = createElemet("li", projectArray[i].projectname);
		li.addEventListener('click', function(){
			
		});
		ul_project.append(li);
		
	}
	startIndex = start+size;
	
}
function initIndexList(){
	var ul_index = $("#ul_index");
	ul_index.html("");
	var index = Math.ceil(projectArray.length / size);
	for(var i = 0; i < index; i++) {
		var li = createElemet("li", null);
		li.setAttribute("value", i );
		li.appendChild(createElemet("a", i + 1))
		li.addEventListener('click', function() {
			console.log("li.val:"+((startIndex/size))+","+$(this).val());
			if((startIndex/size)  != ($(this).val()+1)){
				console.log("size:"+startIndex +","+($(this).val()*size)+","+$(this).val());
				initProjectList($(this).val()*size);
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