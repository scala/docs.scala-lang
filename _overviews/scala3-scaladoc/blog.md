---
layout: multipage-overview
title: Built-in blog
partof: scala3-scaladoc
languages: ["ru"]
num: 5
previous-page: static-site
next-page: site-versioning
---

Scaladoc allows you to include a simple blog in your documentation. For now, it
provides only basic features. In the future, we plan to include more advanced
features like tagging or author pages.

Blog is treated a little differently than regular static sites. This article will help you set up your own blog.

## Proper directory setup

All your blogposts must be put under `_blog/_posts` directory.


```
├── _blog
│   ├── _posts
│   │   └── 2016-12-05-implicit-function-types.md
│   └── index.html
```

Scaladoc loads blog if the `_blog` directory exists.

## Naming convention

All the blogpost filenames should start with date in numeric format matching `YYYY-MM-DD`.
Example name is `2015-10-23-dotty-compiler-bootstraps.md`.

## Page metadata

The blog pages in scaladoc support [Yaml Frontmatter](https://assemble.io/docs/YAML-front-matter.html) which allows you to specify different values which will be used for metadata in your page. Here are the possible fields:

```
---
layout: <A reference to the layout page for the blog page>
author: <Name of the author of the page>
title: <Title of the page>
subTitle: <Subtitle of the page>
date: <Date of the creation of the page>, e.g. 2016-12-05
authorImg: <Link to the author's image>
---
<Content of your page>
```

You can also find more details about the front matter on the [Jekyll documentation site](https://jekyllrb.com/docs/front-matter/).

## Syntax of the content
Keep in mind that the writing of your blog is done with Markdown. You can find more information about the syntax in [Markdown Guide](https://www.markdownguide.org/basic-syntax/).
