"use strict";

var page_id = ((typeof page !== "undefined") ? page : 0);
function scrollToTop(goHome){
	var appLogo = document.getElementById("appLogo");
	if (!goHome) {
		appLogo.removeAttribute("href");
	}
	var headerTitle = appLogo.title;
	var scrollOffset = ((!!document.getElementById("banner")) ? 255 : 28);
	function scrollCheck() {
		if (window.scrollY > scrollOffset) {
			appLogo.classList.add("flip");
			appLogo.title = "Scroll to top!";
			appLogo.style.cursor = "pointer";
		} else {
			appLogo.classList.remove("flip");
			appLogo.title = headerTitle;
			if (!goHome) {
				appLogo.style.cursor = "unset";
			}
		}
	}
	scrollCheck(window);
	window.addEventListener("scroll", scrollCheck, false);
	appLogo.addEventListener("click", function(e){
		if (window.scrollY > scrollOffset) {
			e.preventDefault();
			window.scroll({
				top: 0, 
				left: 0, 
				behavior: 'smooth'
			});
		} else if (!goHome) {
			e.preventDefault();
		}
	});
}

switch (page_id) {
	case "eacf331f0ffc35d4b482f1d15a887d3b": case "af94f605a5f03337965a0a2cb2e9c933": case "104f96574283db8656bc5e4bd122fe1c":
	{
		document.addEventListener("DOMContentLoaded", function(){
			document.getElementById("copyrightYear").innerText = (new Date).getFullYear();
			scrollToTop(page_id != "eacf331f0ffc35d4b482f1d15a887d3b");
		});
		break;
	}
	case "aeeb3f9beb9de9d8a40e72b74dc3ab8e": case "aa8eb2fe477b2d36ecc0f14d6422513f":
	{
		var res_data = [false,false];
		async function loadUpdates(tag) {
			tag = tag || null;
			var results = false;
			const updatesUrl = "/blog/updates.json";
			const githubUrl = "https://api.github.com/users/bradley499/repos";
			const posts = document.createElement("div");
			try {
				if (tag == null || tag == "github") {
					await Promise.all([res_data[0] = await (await fetch(updatesUrl)).json(), res_data[1] = await (await fetch(githubUrl)).json()]);
				} else {
					res_data[0] = await (await fetch(updatesUrl)).json();
					res_data[1] = [];
				}
				try {
					for (let i = 0; i < res_data[0].length; i++) {
						res_data[0][i].push(true);
						res_data[0][i][1] = null;
					}
					if (res_data[1].length > 0) {
						for (let i = res_data[1].length - 1; i >= 0; i--) {
							res_data[0].push([res_data[1][i]["name"],["Bradley created a new repository called \"" + res_data[1][i]["name"] + "\" on GitHub.\n" + res_data[1][i]["description"] + "\nTake a look at it on GitHub at: ", res_data[1][i]["html_url"]],["GitHub"],Date.parse(res_data[1][i]["created_at"])/1000,false]);
						}
					}
				} catch(err) {}
				res_data[0] = res_data[0].sort(function(a,b) {
					return b[3] - a[3];
				});
				res_data = res_data[0];
				for (let i = 0; i < res_data.length; i++) {
					const post_data = res_data[i];
					const post = [document.createElement("a"), document.createElement("div")];
					const title = document.createElement("h3");
					title.innerText = post_data[0];
					let description = [document.createElement("em"), []];
					description[0].innerHTML = convert(post_data[3]);
					if (post_data[4]) {
						description[1].push(document.createElement("p"));
						let relativeTitle = [post_data[0].toLowerCase().split(" ").join("-"), ""];
						const allowedCharacters = "abcdefghijklmnopqrstuvwxyz0123456789-.".split("");
						for (let ii = 0; ii < relativeTitle[0].length; ii++) {
							if (allowedCharacters.indexOf(relativeTitle[0][ii]) >= 0) {
								relativeTitle[1] += relativeTitle[0][ii];
							}
						}
						post[0].href = "/blog/" + relativeTitle[1]
						description[1][0].innerText = "Click to read this blog post.";
						description[1][0].style.fontStyle = "italic";
						post[0].title = "Read the blog post \"" + post_data[0] + "\"";
					} else {
						post[0].href = post_data[1][1];
						post[0].target = "_blank";
						post[0].title = "Take a look at the repository \"" + post_data[0] + "\"";
						post_data[1][0].split("\n").forEach(paragraph => {
							description[1].push(document.createElement("p"));
							description[1][description[1].length - 1].innerText = paragraph;
						});
						description[1][description[1].length - 1].innerHTML += " <a href=\"" + post_data[1][1] + "\" target=\"_blank\">" + post_data[1][1] + "</a>";
					}
					if (tag != null) {
						let tag_match = false;
						for (var ii = post_data[2].length - 1; ii >= 0; ii--) {
							if (tag != null){
								if (post_data[2][ii].toLowerCase() == tag.toLowerCase()){
									tag_match = true;
								}
							}
						}
						if (!tag_match) {
							continue;
						}
					}
					const tags = document.createElement("ul");
					tags.className = "tags";
					post_data[2].forEach(tagName => {
						const tag_element = [document.createElement("li"),document.createElement("a")];
						tagName = ((tagName == "GitHub") ? tagName : tagName.toLowerCase());
						tag_element[1].innerText = "#" + tagName;
						tag_element[1].title = "View more posts tagged: " + tagName;
						tag_element[1].href = "/blog/search/" + tagName.toLowerCase();
						tag_element[0].appendChild(tag_element[1]);
						tags.appendChild(tag_element[0]);
					});
					tags.lastChild.classList.add("noAfter");
					post[1].appendChild(title);
					post[1].appendChild(description[0]);
					description[1].forEach(paragraph => {
						post[1].appendChild(paragraph);
					});
					if (post_data[2].length > 0) {
						post[1].appendChild(tags);
					}
					post[0].appendChild(post[1]);
					posts.appendChild(post[0]);
					results = true;
				}
			} catch(e) {console.log(e)}
			if (!results) {
				const noResults = document.createElement("p");
				noResults.classList.add("centerContent");
				if (tag != null) {
					noResults.innerHTML = "Unfortunately, there were no posts that matched your search. Why not <a href=\"/blog\" title=\"View all blog posts\">view all blog posts</a>?";
				} else {
					noResults.innerHTML = "Unfortunately an error occurred, and no posts were loaded. Why not <a href=\"/blog\" title=\"Try to reload blog posts\">try again</a>?";
				}
				posts.appendChild(noResults);
			} else if (tag != null) {
				const viewAll = document.createElement("p");
				viewAll.classList.add("centerContent");
				viewAll.innerHTML = "<a href=\"/blog/\" title=\"View all blog posts\">View all blog posts?</a>";
				posts.appendChild(viewAll);
			}
			const blogList = document.getElementById("blogPosts");
			blogList.innerHTML = "";
			blogList.appendChild(posts);
		}
		function convert(unixTimestamp){
			unixTimestamp = unixTimestamp || 0;
			var months_arr = ['January','February','March','April','May','June','July','August','September','October','November','December'];
			var date = new Date(unixTimestamp*1000);
			date = new Date(date.getTime() + (date.getTimezoneOffset()*60000));
			var year = date.getFullYear();
			var month = months_arr[date.getMonth()];
			var day = date.getDate();
			var hours = "0" + date.getHours();
			var minutes = "0" + date.getMinutes();
			return month+'&nbsp;'+day+',&nbsp;'+year+'&nbsp;-&nbsp;'+hours.substr(-2)+':'+minutes.substr(-2);
		}
		document.addEventListener("DOMContentLoaded", function(){
			document.getElementById("copyrightYear").innerText = (new Date).getFullYear();
			scrollToTop(true);
			const searchPath = "/blog/search/";
			if (window.location.pathname.startsWith(searchPath)) {
				const searchTag = window.location.pathname.substr(searchPath.length);
				if (page_id == "aa8eb2fe477b2d36ecc0f14d6422513f") {
					document.title = searchTag.trim() + " | Search | Bradley Marshall";
					let blogPostsTitle = document.getElementById("errorTitle");
					blogPostsTitle.id = "blogPostsTitle";
					blogPostsTitle.innerText = "Blog posts tagged: " + searchTag;
					let blogPosts = document.getElementById("errorMessage");
					blogPosts.id = "blogPosts";
					blogPosts.innerHTML = "<p class=\"centerContent\">Loading...</p>";
				}
				loadUpdates(searchTag);
			} else if (window.location.pathname == "/blog/") {
				loadUpdates(null);
			}
		});
		break;
	}
	default:
		break;
}