var attachmentFormats = [
	["png","image"],
	["jpeg","image"],
	["jpg","image"],
	["bmp","image"],
	["gif","image"],
	["avi","audio"],
	["mp3","audio"],
	["wav","audio"],
	["mp4","video"],
	["webm","video"],
	["ogg","video"],
	["pdf","pdf"],
	["doc","document"],
	["docx","document"],
	["odt","document"],
	["rtf","document"],
	["txt","document"],
	["wps","document"],
	["xls","spreadsheet"],
	["ods","spreadsheet"],
	["csv","spreadsheet"],
	["json","spreadsheet"],
	["xlsx","spreadsheet"],
	["ppt","presentation"],
	["pps","presentation"],
	["ppsx","presentation"],
	["pptx","presentation"],
	[null,"null"]
];
var errorDocument = "<h1>404 - not found!</h1><p>Oh dear... Somehow you've gotten very lost.</p><p><a href=\"/\" class=\"linkBlank\">Click here to go </a><a href=\"/\" class=\"link\">home</a><a href=\"/\" class=\"linkBlank\">.</a></p>";

function loadUpdates(uid=null,tag=null) {
	if (uid != null && tag != null) {
		document.getElementById("updateContent").innerHTML = errorDocument;
		return false;
	}
	var request = new XMLHttpRequest();
	request.open('GET', '/updates.json', true);
	request.onreadystatechange = function() {
		var data = []
		if (this.readyState === 4) {
			if (this.status >= 200 && this.status < 400) {
				try {
					data = JSON.parse(this.responseText);
				} catch {}
			}
			document.getElementById("updateContent").innerHTML = buildUpdates(data,uid,tag);
			if (uid != null) {
				var el = document.getElementsByClassName("updateMessageLink");
				for (var i=0; i < el.length; i++) {
					el.item(i).outerHTML = el.item(i).innerHTML;
				}
			}
			refreshTriggers();
		}
	};
	request.send();
	request = null;
};

function buildUpdates(data = [], uid = null, tag = null) {
	if (data.length >= 1) {
		var base = 1;
		updateMessage = [];
		updateBase = "<div class=\"updateMessage {{isResultsPage}}\"><a href=\"/updates/{{uid}}\" class=\"updateMessageLink\"><h2 class=\"updateMessageTitle updateMessageShowLink{{isResultsPage}}\">{{header}}</h2></a>{{attachments}}{{perLine}}<div class=\"updateMessageTagsContainer\">{{categories}}</div><div class=\"updateMessagePublishTime\"><a href=\"/updates/{{uid}}\" class=\"updateMessageLink\">{{time}}</a></div></div>";
		perLine = "<p class=\"updateMessageContent\">{{message}}</p>";
		attachments = "<div class=\"updateMessageAttachmentsContainerBase\"><div class=\"updateMessageAttachmentsContainer {{containerBaseOveride}}\">{{attachment}}</div></div>";
		attachment = "<div class=\"updateMessageAttachments{{isResultsPageShow}} {{positional}}\">{{attachmentPreview}}</div>";
		categories = "<a href=\"/updates/tags/{{category}}\" class=\"updateMessageTag link\" title=\"View more posts tagged: {{category}}\">{{category}}</a>";
		var uid_match = false;
		for (var i = data.length - 1; i >= 0; i--) {
			if (uid != null) {
				uid_match = (i+1 == uid);
				if (!uid_match) {
					continue;
				}
			}
			updateBaseBuild = updateBase;
			data[i][1] = data[i][1].split("\n");
			updateLine = []
			for (var ii = data[i][1].length - 1; ii >= 0; ii--) {
				perLineBuild = perLine
				perLineBuild = perLineBuild.replace("{{message}}",data[i][1][ii].split("&").join("&amp;").split("\"").join("&quot;").split("'").join("&#39;").split("<").join("&lt;").split(">").join("&gt;").split("{").join("&#123;").split("}").join("&#125;"));
				updateLine.unshift(perLineBuild);
			}
			categoriesCollection = [];
			tag_match = false;
			for (var ii = data[i][3].length - 1; ii >= 0; ii--) {
				if (tag != null){
					if (data[i][3][ii] == tag){
						tag_match = true;
					}
				}
				categoriesBuild = categories;
				categoriesBuild = categoriesBuild.split("{{category}}").join(data[i][3][ii]);
				categoriesCollection.unshift(categoriesBuild);
			}
			if (tag != null) {
				if (!tag_match) {
					continue;
				}
			}
			attachmentsCollection = [];
			attachmentFormatsDisplay = {
				"image": "<div class=\"updateMessageAttachmentImage updateMessageAttachmentPreviewThumbnail {{positionalMax}}\" style=\"--data-image-src: url('/assets/posts/{{fileName}}')\" data-file=\"assets/posts/{{fileName}}\" alt=\"{{alt}}\" title=\"{{alt}}\"></div>",
				"video": "<div class=\"updateMessageAttachmentVideo{{validThumb}} updateMessageAttachmentPreviewThumbnail {{positionalMax}}\" style=\"--data-image-src: url('/assets/posts/{{fileNameThumb}}')\" data-file=\"assets/posts/{{fileName}}\" alt=\"{{alt}}\" title=\"{{alt}}\"></div>",
				"audio": "<div class=\"updateMessageAttachmentAudio updateMessageAttachmentPreviewThumbnail {{positionalMax}}\" style=\"--data-image-src: url('/assets/posts/{{fileName}}')\" data-file=\"assets/posts/{{fileName}}\" alt=\"{{alt}}\" title=\"{{alt}}\"></div>",
				"pdf": "<div class=\"updateMessageAttachmentPdf updateMessageAttachmentPreviewThumbnail {{positionalMax}}\" data-file=\"assets/posts/{{fileName}}\" alt=\"{{alt}}\" title=\"{{alt}}\"></div>",
				"document": "<div class=\"updateMessageAttachmentDocument updateMessageAttachmentPreviewThumbnail {{positionalMax}}\" data-file=\"assets/posts/{{fileName}}\" alt=\"{{alt}}\" title=\"{{alt}}\"></div>",
				"Spreadsheet": "<div class=\"updateMessageAttachmentSpreadsheet updateMessageAttachmentPreviewThumbnail {{positionalMax}}\" data-file=\"assets/posts/{{fileName}}\" alt=\"{{alt}}\" title=\"{{alt}}\"></div>",
				"presentation": "<div class=\"updateMessageAttachmentPresentation updateMessageAttachmentPreviewThumbnail {{positionalMax}}\" data-file=\"assets/posts/{{fileName}}\" alt=\"{{alt}}\" title=\"{{alt}}\"></div>",
				"null": "<div class=\"updateMessageAttachmentUnknown updateMessageAttachmentPreviewThumbnail {{positionalMax}}\" data-file=\"assets/posts/{{fileName}}\" alt=\"{{alt}}\" title=\"{{alt}}\"></div>",
				"more": "<div class=\"updateMessageAttachmentMore updateMessageAttachmentMoreIfSmall OutOf4\" title=\"View more...\" post-parent-id=\"{{uid}}\"></div>"
			}
			for (var ii = 0; ii < data[i][2].length; ii++) {
				attachmentBuild = attachment;
				fileType = data[i][2][ii][0].substr(data[i][2][ii][0].lastIndexOf('.') + 1);
				validFileFormat = "null";
				for (var iii = attachmentFormats.length - 1; iii >= 0; iii--) {
					if (attachmentFormats[iii][0] == fileType) {
						validFileFormat = attachmentFormats[iii][1];
					}
				}
				if (validFileFormat == "video") {
					if (data[i][2][ii].length == 3){
						attachmentBuild = attachmentBuild.replace("{{attachmentPreview}}",attachmentFormatsDisplay[validFileFormat].replace("{{validThumb}}","Render").replace("{{fileNameThumb}}",data[i][2][ii][2]).replace("{{fileName}}",data[i][2][ii][0]));
					}
					else
					{
						attachmentBuild = attachmentBuild.replace("{{attachmentPreview}}",attachmentFormatsDisplay[validFileFormat].replace("{{validThumb}}","").replace("style=\"--data-image-src: url('/assets/posts/{{fileNameThumb}}')\" ","").replace("{{fileName}}",data[i][2][ii][0]));
					}
				} else {
					attachmentBuild = attachmentBuild.replace("{{attachmentPreview}}",attachmentFormatsDisplay[validFileFormat].split("{{fileName}}").join(data[i][2][ii][0]));
				}
				if (!uid_match) {
					if (ii == 2 || data[i][2].length <= 4) {
						attachmentBuild = attachmentBuild.replace("{{positional}}","is" + (ii + 1).toString() + "OutOf" + Math.min(data[i][2].length,4));
						attachmentBuild = attachmentBuild.replace("{{positionalMax}}","OutOf" + Math.min(data[i][2].length,4));
					}
					else
					{
						attachmentBuild = attachmentBuild.replace("{{positional}}","is" + (ii + 1).toString() + "OutOf" + Math.min(data[i][2].length,4));
						attachmentBuild = attachmentBuild.replace("{{positionalMax}}","OutOf" + Math.min(data[i][2].length,4));
					}
				} else {
					attachmentBuild = attachmentBuild.replace("{{positional}}","").replace("{{positionalMax}}","");
					if (data[i][2][ii][1].length > 0) {
						attachmentBuild += "<p class=\"updateMessageAttachmentDisplayAltText\">" + data[i][2][ii][1].split("&").join("&amp;").split("\"").join("&quot;").split("'").join("&#39;").split("<").join("&lt;").split(">").join("&gt;").split("{").join("&#123;").split("}").join("&#125;") + "</p>";
					}
				}
				attachmentBuild = attachmentBuild.split("{{alt}}").join(data[i][2][ii][1].split("&").join("&amp;").split("\"").join("&quot;").split("'").join("&#39;").split("<").join("&lt;").split(">").join("&gt;").split("{").join("&#123;").split("}").join("&#125;"));
				attachmentsCollection.push(attachmentBuild);
				if (!uid_match) {
					if (ii == 2 && data[i][2].length > 4) {
						attachmentsCollection.push(attachment.replace("{{attachmentPreview}}",attachmentFormatsDisplay["more"].replace("updateMessageAttachmentMoreIfSmall","")).replace("{{positional}}","is4OutOf4"));
						break;
					}
					else if (ii >= data[i][2].length) {
						attachmentsCollection.push(attachment.replace("{{attachmentPreview}}",attachmentFormatsDisplay["more"].replace("{{positionalMax}}","")));
					}
				}
			}
			updateBaseBuild = updateBaseBuild.replace("{{perLine}}",updateLine.join(""));
			if (attachmentsCollection.length > 0) {
				updateBaseBuild = updateBaseBuild.replace("{{attachments}}",attachments.replace("{{attachment}}",attachmentsCollection.join("")));
			}
			else
			{
				updateBaseBuild = updateBaseBuild.replace("{{attachments}}","");
			}
			if (categoriesCollection.length > 0) {
				updateBaseBuild = updateBaseBuild.replace("{{categories}}",categoriesCollection.join(" "));
			} else {
				updateBaseBuild = updateBaseBuild.replace("{{categories}}","");
			}
			updateBaseBuild = updateBaseBuild.replace("{{time}}",convert(data[i][4]));
			updateBaseBuild = updateBaseBuild.replace("{{header}}",data[i][0]);
			updateBaseBuild = updateBaseBuild.split("{{uid}}").join((i+1));
			if (uid_match) {
				updateBaseBuild = updateBaseBuild.replace("{{containerBaseOveride}}","updateMessageAttachmentsContainerShowAll").split("{{isResultsPage}}").join("borderNo").split("{{isResultsPageShow}}").join("Results");
			} else {
				updateBaseBuild = updateBaseBuild.replace("{{containerBaseOveride}}","").split("{{isResultsPage}}").join("").split("{{isResultsPageShow}}").join("");
			}
			updateMessage.push(updateBaseBuild);
			if (uid_match) {
				document.title = data[i][0] + " ~ Blog ~ Bradley Marshall";
				break;
			}
		}
		if (uid != null && !uid_match) {
			return errorDocument;
		} else {
			if (tag != null && updateMessage.length == 0) {
				return "<p>Nothing to show, as no posts are tagged with \"<b>" + tag + "</b>\", maybe check again soon to see if anything has occured... <a href=\"/updates\" title=\"View all...\" class=\"link\">View all updates</a>?</p>";
			}
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
	var convdataTime = month+'&nbsp;'+day+'&nbsp;'+year+'&nbsp;-&nbsp;'+hours + ':' + minutes.substr(-2);
	return convdataTime; 
}

function attachmentSelection(event) {
	if (event == undefined || !event.target.matches(".updateMessageAttachmentPreviewThumbnail")) {
		return false;
	}
	try
	{
		var previewFile = [event.target.getAttribute("data-file"),event.target.getAttribute("alt")];
		event.preventDefault();		
	} catch {return false;}
	fileType = previewFile[0].substr(previewFile[0].lastIndexOf(".") + 1);
	validFileFormat = "null";
	for (var iii = attachmentFormats.length - 1; iii >= 0; iii--) {
		if (attachmentFormats[iii][0] == fileType) {
			validFileFormat = attachmentFormats[iii][1];
		}
	}
	if (["pdf","document","presentation","spreadsheet","null"].includes(validFileFormat)) {
		window.open("/" + previewFile[0], "_blank");
		return true;
	}
	showDisplayElement(true,validFileFormat,previewFile[0],previewFile[1]);
}

function previewViewMore(event) {
	try {
		window.location.href = "/updates/" + event.target.getAttribute("post-parent-id");
	} catch {}
}

function showDisplayElement(show=true,type=null,reference=null,alt=null) {
	if ((type == null || reference == null) && show) {
		return false;
	}
	show = show == true;
	var display = null;
	for (var i = 0; i <= 1; i++) {
		try {
			display = document.getElementById("displayAttachmentOverlay");
			display.addEventListener("click",hideDisplayElement);
			if (display == undefined){
				throw undefined;
			}
			else
			{
				break;
			}
		} catch {
			if (show) {
				document.body.innerHTML += "<div id=\"displayAttachmentOverlay\"></div>";
			}
		}
	}
	if (display == null) {
		return null;
	} else {
		if (!show) {
			if (display.classList) {
				display.classList.add("hide");
			} else {
				var current = display.hide, found = false;
				var all = current.split(" ");
				for(var i=0; i<all.length, !found; i++){
					found = all[i] === "hide";
				}
				if(!found) {
					if(current === ""){
						display.hide = "hide";
					} else {
						display.hide += " " + "hide";
					}
				}
			}
			display.innerHTML = "";
			document.documentElement.style.overflow = "auto";
			document.body.scroll = "yes";
			return true;
		}
		document.documentElement.style.overflow = "hidden";
		document.body.scroll = "no";
		if (display.classList) {
			display.classList.remove("hide");
		} else {
			display.hide = display.hide.replace(new RegExp('(^|\\b)' + hide.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
		}
		var contentDisplay = "?";
		switch(type) {
			case "image":
				contentDisplay = "<img src=\"/" + encodeURIComponent(reference) + "\" class=\"displayAttachmentSizing ignore\">";
				break
			case "video":
				fileType = reference.substr(reference.lastIndexOf(".") + 1);
				validFileFormat = null;
				for (var iii = attachmentFormats.length - 1; iii >= 0; iii--) {
					if (attachmentFormats[iii][0] == fileType) {
						validFileFormat = attachmentFormats[iii][1];
					}
				}
				if (validFileFormat == null) {
					break;
				}
				contentDisplay = "<video controls autoplay=\"true\" class=\"displayAttachmentSizing displayAttachmentVideo ignore\"><source src=\"/" + encodeURIComponent(reference) + "\" type=\"video/" + fileType + "\">Your browser does not support the video.</video>";
				break
			case "audio":
				fileType = reference.substr(reference.lastIndexOf(".") + 1);
				validFileFormat = null;
				for (var iii = attachmentFormats.length - 1; iii >= 0; iii--) {
					if (attachmentFormats[iii][0] == fileType) {
						validFileFormat = attachmentFormats[iii][1];
					}
				}
				if (validFileFormat == null) {
					break;
				}
				contentDisplay = "<audio controls autoplay=\"true\" class=\"displayAttachmentSizing ignore\"><source src=\"/" + encodeURIComponent(reference) + "\" type=\"audio/" + fileType + "\">Your browser does not support the video.</audio>";
				break
		}
		display.innerHTML = "<div style=\"overflow-x:hidden;overflow-y:auto;max-height:95vh;padding:2.5vh 0\"><div><table id=\"displayAttachmentTableContainer\"><tr align=\"center\" valign=\"middle\"><td>" + contentDisplay + "</td></tr><tr><td valign=\"top\"><div class=\"displayAttachmentSizing ignore\"><p class=\"ignore\">" + alt.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {return '&#'+i.charCodeAt(0)+';'}).split("\n").join("</p><p class=\"ignore\">") + "</p></div></td></tr></table></div></div>"
	}
}

function hideDisplayElement(event = false){
	if (event != false){
		if (event.target.classList.contains("ignore")) {
			return false;
		}
	}
	showDisplayElement(false);
	refreshTriggers();
}
function refreshTriggers(){
	var classes = ["updateMessageAttachmentPreviewThumbnail","updateMessageAttachmentMain"];
	for (var i = classes.length - 1; i >= 0; i--) {
		classes[i]
	}
	var el = document.getElementsByClassName("updateMessageAttachmentPreviewThumbnail");
	for (var i=0; i < el.length; i++) {
		el.item(i).addEventListener("click",attachmentSelection,true);
	}
	var el = document.getElementsByClassName("updateMessageAttachmentMore");
	for (var i = 0; i < el.length; i++) {
		el.item(i).addEventListener("click",previewViewMore,true);
	}
}

if (["/updates","/updates.html"].includes(window.location.pathname)){
	window.addEventListener("load", loadUpdates());
}
document.onkeydown = function(evt) {
    evt = evt || window.event;
    var isEscape = false;
    if ("key" in evt) {
        isEscape = (evt.key === "Escape" || evt.key === "Esc");
    } else {
        isEscape = (evt.keyCode === 27);
    }
    if (isEscape) {
    	hideDisplayElement();
    }
};