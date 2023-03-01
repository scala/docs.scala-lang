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

## Structure

When creating a blog page, you will have a first part to fill in with different fields. See the following example:

```
---
layout: <A reference to the layout page for the blog page>
author: <Name of the author of the page>
title: <Title of the page>
subTitle: <Subtitle of the page>
excerpt_separator: <!--more-->
date: <Date of the creation of the page>
authorImg: <Link to the author's image>
---
<Content>
```

## Special characters for the content

` ```<content>``` ` : For code

`## Subtitle` : For subtitles

`word` : To highlight

`[word](Link to a website)`: If you want to put a link in a word