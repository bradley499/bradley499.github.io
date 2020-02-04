function loadUpdates() {
	var request = new XMLHttpRequest();
	request.open('GET', 'updates.json', true);
	request.onreadystatechange = function() {
		var data = []
		if (this.readyState === 4) {
			if (this.status >= 200 && this.status < 400) {
				try {
					data = JSON.parse(this.responseText);
				} catch {}
			}
			document.getElementById("updateContent").innerHTML = buildUpdates(data);
		}
	};
	request.send();
	request = null;
};

function buildUpdates(data = []) {
	if (data.length >= 1) {
		var base = 1;
		updateMessage = [];
		updateBase = "<div class=\"updateMessage\">{{perLine}}<span class=\"updateMessageTime\">{{time}}</span></div>";
		perLine = "<p class=\"updateMessageContent\">{{message}}</p>";
		for (var i = data.length - 1; i >= 0; i--) {
			updateBaseBuild = updateBase;
			data[i][0] = data[i][0].split("\n");
			updateLine = []
			for (var ii = data[i][0].length - 1; ii >= 0; ii--) {
				perLineBuild = perLine
				perLineBuild = perLineBuild.replace("{{message}}",data[i][0][ii]);
				updateLine.unshift(perLineBuild);
			}
			updateBaseBuild = updateBaseBuild.replace("{{perLine}}",updateLine.join(""));
			updateBaseBuild = updateBaseBuild.replace("{{time}}",convert(data[i][1]));
			updateMessage.push(updateBaseBuild);
		}
		return updateMessage.join("");
	}
	else
	{
		return "<p>Nothing to show yet, come back soon to find more...</p>";
	}
}

function convert(unixtimestamp = 0){
	var months_arr = ['January','February','March','April','May','June','July','August','September','October','November','December'];
	var date = new Date(unixtimestamp*1000);
	var year = date.getFullYear();
	var month = months_arr[date.getMonth()];
	var day = date.getDate();
	var hours = date.getHours();
	var minutes = "0" + date.getMinutes();
	var convdataTime = month+' '+day+' '+year+' - '+hours + ':' + minutes.substr(-2);
	return convdataTime; 
}

window.addEventListener('load', loadUpdates());