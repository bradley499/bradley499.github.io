from string import Template
import json
from datetime import datetime, timedelta
import tzlocal

def main():
	sitemap_url = ["","blog/", "laturon/"]
	with open("../blog/updates.json", "r") as updates:
		blogPosts = []
		updates = json.load(updates)
		updates = sorted(updates, key = lambda x: x[3], reverse = True)
		titles = []
		for post in updates:
			title = "".join(c for c in post[0].replace(" ","-").lower() if c in "abcdefghijklmnopqrstuvwxyz0123456789-.")
			if title in titles:
				print("Unable to update blogs, as the title \"{0}\" is used multiple times.".format(title))
				exit(1)
			else:
				titles.append(title)
			for tag in post[2]:
				if tag.lower() != "".join(c for c in tag.lower() if c in "abcdefghijklmnopqrstuvwxyz0123456789_."):
					print("Unable to updates blogs, as there is a tag with an value that does not conform to the standard format \"{0}\".".format(tag))
					exit()
		if "index" in titles:
			print("Unable to updates blogs, as the title \"index\" is used, which is a reserved filename.")
			exit(1)
		if "search" in titles:
			print("Unable to updates blogs, as the title \"search\" is used, which is a reserved filename.")
			exit(1)
		for x in range(len(titles)):
			sitemap_url.append("blog/{0}".format(titles[x]))
			with open("../blog/{0}.html".format(titles[x]), "w") as blog:
				tags = ["<a title=\"View more posts tagged: {0}\" href=\"/blog/search/{0}\">#{0}</a>".format(tag) for tag in updates[x][2]]
				tags = "										<li>" + "</li><li>".join(tags) + "</li>"
				tags = "<li class=\"noAfter\">".join(tags.rsplit("<li>", 1))
				time = datetime.fromtimestamp(updates[x][3], tzlocal.get_localzone())
				if bool(time.dst()):
					time -= timedelta(hours=(int)(time.dst().seconds / 3600))
				timeISO8601 = time.isoformat()
				time = time.strftime("%B %-d, %Y - %H:%M")
				blogPosts.append("\n								<a href=\"/blog/{0}\" title=\"Read the blog post &quot;{1}&quot;\">\n									<div>\n										<h3>{1}</h3>\n										<em>{2}</em>\n										<p style=\"font-style: italic;\">Click to read this blog post.</p>\n										<ul class=\"tags\">\n{3}\n										</ul>\n									</div>\n								</a>".format(titles[x], updates[x][0], time, tags))
				content = [[]]
				description = updates[x][0] + ": "
				for element in updates[x][1]:
					if element[0] == 0:
						element[1] = element[1].split("\n")
						if len(element[1]) == 1:
							description += element[1][0]
							content[(len(content) - 1)].append(element[1][0])
						else:
							paragraph = element[1].pop(0)
							content[(len(content) - 1)].append(paragraph)
							description += paragraph + " "
							for paragraph in element[1]:
								description += paragraph
								content.append([paragraph])
					elif element[0] == 1:
						description += element[2]
						content[(len(content) - 1)].append("<a href=\"{0}\" title=\"Go to {1}\" target=\"_blank\">{1}</a>".format(element[1], element[2]))
				if content == [[]]:
					print("Unable to create blog post \"{0}\", as it's content is empty.".format(updates[x][0]))
				for paragraph in range(len(content)):
					content[paragraph] = "".join(content[paragraph])
				content = "<p>" + "</p>\n								<p>".join(content) + "</p>"
				if (len(updates[x][0]) < 90):
					description = description[:(119 - len(updates[x][0]))]
					while True:
						description = description[:(len(description) - 1)]
						if description[-1] == " ":
							description = description[:(len(description) - 1)]
							if description[-1] in "abcdefghijklmnopqrstuvwxyz":
								break
				description += "... Post by Bradley Marshall"
				html = Template("""<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n	<title>$title | Blog | Bradley Marshall</title>\n	<script type="application/ld+json">\n	{\n	"@context": "https://schema.org",\n	"@type": "BlogPosting",\n	"author": {\n		"@type": "Person",\n		"name": "Bradley Marshall"\n	},\n	"publisher": {\n		"@type": "Organization",\n		"name": "Bradley Marshall",\n        "logo": {\n			"@type": "ImageObject",\n			"url": "https://github.com/bradley499.png"\n		}\n	},\n	"image": "https://github.com/bradley499.png",\n\n	"headline": "$title",\n	"datePublished": "$date",\n	"dateModified": "$date",\n	"description": "$description"\n	}\n	</script>\n	<meta name=\"description\" content=\"$description\">\n	<meta name=\"viewport\" content=\"width=device-width, user-scalable=no\">\n	<link rel=\"stylesheet\" type=\"text/css\" href=\"/assets/style.css\">\n	<link rel=\"shortcut icon\" type=\"image/x-icon\" href=\"/favicon.ico\">\n	<script type=\"text/javascript\">const page = \"af94f605a5f03337965a0a2cb2e9c933\";</script>\n	<script type=\"text/javascript\" src=\"/assets/interact.js\"></script>\n</head>\n<body class=\"generic\">\n	<div class=\"mainContent\">\n		<div id=\"headerNavigation\">\n			<a href=\"/\" id=\"appLogo\" title=\"Bradley Marshall\"></a>\n			<a href=\"https://www.linkedin.com/in/bradley499/\" class=\"navLink\" id=\"linkedin\" title=\"View my LinkedIn\" target=\"_blank\"></a>\n			<a href=\"https://github.com/bradley499\" class=\"navLink\" id=\"github\" title=\"View my GitHub\" target=\"_blank\"></a>\n		</div>\n		<div>\n			<div class=\"sidePadding\">\n				<section class=\"sidePadding\">\n					<div class=\"bigPad\">\n						<h1 class=\"bigCenter centerContent\" id=\"blogPostsTitle\">$title</h1>\n						<div>\n							<div>\n								$content\n							</div>\n							<div>\n								<div>\n									<ul class=\"tags\" id=\"blogPostTags\">\n$tags\n									</ul>\n								</div>\n								<div class=\"blogPostTime\">\n									<p>$time</p>\n								</div>\n							<p id=\"blogPostsMore\">Read more <a href=\"/blog/\" title=\"Read more blog posts\">blog posts</a>?</p>\n						</div>\n					</div>\n				</section>\n			</div>\n			<footer>\n				<div class=\"footerDecoration\">\n					<div class=\"leftBottom\">\n						<div></div>\n					</div>\n					<div class=\"rightBottom\">\n						<div></div>\n					</div>\n				</div>\n				<div class=\"footerNavigation\" class=\"privacy\">\n					<em>&copy; Bradley Marshall <span id=\"copyrightYear\"></span></em>\n				</div>\n			</footer>\n		</div>\n	</div>\n</body>\n</html>""")
				html = html.safe_substitute(title=updates[x][0], description=description, content=content, tags=tags, time=time, date=timeISO8601)
				blog.truncate(0)
				blog.write(html)
	with open("../blog/index.html", "w") as index:
		blogPosts = "".join(blogPosts)
		index.truncate(0)
		index.write("<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n	<title>Blog | Bradley Marshall</title>\n	<meta name=\"description\" content=\"Blog updates published by Bradley Marshall\">\n	<meta name=\"viewport\" content=\"width=device-width, user-scalable=no\">\n	<link rel=\"stylesheet\" type=\"text/css\" href=\"/assets/style.css\">\n	<link rel=\"shortcut icon\" type=\"image/x-icon\" href=\"/favicon.ico\">\n	<script type=\"text/javascript\">const page = \"aeeb3f9beb9de9d8a40e72b74dc3ab8e\";</script>\n	<script type=\"text/javascript\" src=\"/assets/interact.js\"></script>\n</head>\n<body class=\"generic\">\n	<div class=\"mainContent\">\n		<div id=\"headerNavigation\">\n			<a href=\"/\" id=\"appLogo\" title=\"Bradley Marshall\"></a>\n			<a href=\"https://www.linkedin.com/in/bradley499/\" class=\"navLink\" id=\"linkedin\" title=\"View my LinkedIn\" target=\"_blank\"></a>\n			<a href=\"https://github.com/bradley499\" class=\"navLink\" id=\"github\" title=\"View my GitHub\" target=\"_blank\"></a>\n		</div>\n		<div>\n			<div class=\"sidePadding\">\n				<section class=\"sidePadding\">\n					<div class=\"bigPad\">\n						<h1 class=\"bigCenter centerContent\" id=\"blogPostsTitle\">Blog posts</h1>\n						<div id=\"blogPosts\">\n							<div>" + blogPosts + "\n							</div>\n</div>\n</div>\n</section>\n</div>\n<footer>\n<div class=\"footerDecoration\">\n<div class=\"leftBottom\">\n	<div></div>\n</div>\n<div class=\"rightBottom\">\n	<div></div>\n</div>\n</div>\n<div class=\"footerNavigation\" class=\"privacy\">\n<em>&copy; Bradley Marshall <span id=\"copyrightYear\"></span></em>\n</div>\n</footer>\n</div>\n</div>\n</body>\n</html>")
	with open("../sitemap.xml", "w") as sitemap:
		urls = []
		for url in sitemap_url:
			urls.append("https://bradley499.github.io/" + url)
		sitemap.truncate(0)
		sitemap.write("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">")
		while len(urls) > 0:
			url = urls.pop(0)
			sitemap.write("<url>\n	<loc>"+url+"</loc>\n	<lastmod>" + datetime.now().strftime("%Y-%m-%d") + "</lastmod>\n	<priority>");
			if url == "https://bradley499.github.io/":
				sitemap.write("1.0")
			elif url == "https://bradley499.github.io/blog/":
				sitemap.write("0.8")
			else:
				sitemap.write("0.7")
			sitemap.write("</priority>\n</url>\n")
		sitemap.write("</urlset>")

if __name__ == "__main__":
	main()