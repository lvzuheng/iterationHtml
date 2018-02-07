function load_dialog(contant) {
	var loading = dialog({
		title: contant,
		width: "auto",
		quickClose: true
	});
	return loading;
}

function info_dialog(content) {
	var info = dialog({
		content: content,
		width: "auto",
		quickClose: true
	});
	return info;
}

function showInfoDialog(content, delay) {
	var info = dialog({
		content: content,
		width: "auto",
		quickClose: true
	});
	info.show();
	setTimeout(function() {
		info.close();
	}, delay);
}