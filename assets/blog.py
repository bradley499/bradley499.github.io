from string import Template
import json
from datetime import datetime, timedelta
import tzlocal

def main():
	sitemap_url = ["","contact","blog/"]
	with open("../blog/updates.json", "r") as updates:
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
				time = datetime.fromtimestamp(updates[x][3], tzlocal.get_localzone())
				if bool(time.dst()):
					time -= timedelta(hours=(int)(time.dst().seconds / 3600))
				time = time.strftime("%B %-d, %Y - %H:%M")
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
				html = Template("""<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n	<title>$title | Blog | Bradley Marshall</title>\n	<meta name=\"description\" content=\"$description\">\n	<meta name=\"viewport\" content=\"width=device-width, user-scalable=no\">\n	<link rel=\"stylesheet\" type=\"text/css\" href=\"/assets/style.css\">\n	<link rel=\"shortcut icon\" type=\"image/x-icon\" href=\"/favicon.ico\">\n	<script type=\"text/javascript\">const page = \"af94f605a5f03337965a0a2cb2e9c933\";</script>\n	<script type=\"text/javascript\" src=\"/assets/interact.js\"></script>\n	<script async src=\"https://www.googletagmanager.com/gtag/js?id=UA-157001746-1\"></script>\n	<script>\n		window.dataLayer = window.dataLayer || [];\n		function gtag() { dataLayer.push(arguments); }\n		gtag('js', new Date());\n		gtag('config', 'UA-157001746-1');\n	</script>\n</head>\n<body class=\"generic\">\n	<div class=\"mainContent\">\n		<div id=\"headerNavigation\">\n			<a href=\"/\" id=\"appLogo\" title=\"Bradley Marshall\"></a>\n			<a href=\"/contact\" class=\"navLink\" id=\"contactLink\" title=\"Contact me\">Contact</a>\n			<a href=\"https://github.com/bradley499\" class=\"navLink\" id=\"github\" title=\"View my GitHub\"\n				target=\"_blank\"></a>\n		</div>\n		<div>\n			<div class=\"sidePadding\">\n				<section class=\"sidePadding\">\n					<div class=\"bigPad\">\n						<h1 class=\"bigCenter centerContent\" id=\"blogPostsTitle\">$title</h1>\n						<div>\n							<div>\n								$content\n							</div>\n							<div>\n								<div>\n									<ul class=\"tags\" id=\"blogPostTags\">\n$tags\n									</ul>\n								</div>\n								<div class=\"blogPostTime\">\n									<p>$time</p>\n							</div>\n						<p id=\"blogPostsMore\">Read more <a href=\"/blog/\" title=\"Read more blog posts\">blog posts</a>?</p>\n						</div>\n					</div>\n				</section>\n			</div>\n			<footer>\n				<div class=\"footerDecoration\">\n					<div class=\"leftBottom\">\n						<div></div>\n					</div>\n					<div class=\"rightBottom\">\n						<div></div>\n					</div>\n				</div>\n				<div class=\"footerNavigation\" class=\"privacy\">\n					<p class=\"noBottom\">This page uses <a href=\"/policies#cookies\" class=\"boldLink\"\n							title=\"Read the Cookie Policy\">Cookies</a> for analytical purposes.</p>\n					<em>&copy; Bradley Marshall <span id=\"copyrightYear\"></span></em>\n				</div>\n			</footer>\n		</div>\n	</div>\n</body>\n</html>""")
				html = html.safe_substitute(title=updates[x][0], description=description, content=content, tags="										<li>" + "</li>\n										<li>".join(tags) + "</li>", time=time)
				blog.truncate(0)
				blog.write(html)
	with open("../sitemap.txt", "w") as sitemap:
		urls = []
		for url in sitemap_url:
			urls.append("https://bradley499.github.io/" + url)
		sitemap.truncate(0)
		while len(urls) > 0:
			sitemap.write(urls.pop(0))
			if len(urls) > 0:
				sitemap.write("\n")

if __name__ == "__main__":
	main()