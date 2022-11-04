---
layout: multipage-overview
title: Статичная документация
partof: scala3-scaladoc
language: ru
num: 4
previous-page: linking
next-page: blog
---

Scaladoc can generate static sites, known from [Jekyll](http://jekyllrb.com/) or [Docusaurus](https://docusaurus.io/).
Having a combined tool allows providing interaction between static documentation and API, thus allowing the two to blend naturally.

Creating a site is just as simple as in Jekyll. The site root contains the
the layout of the site and all files placed there will be either considered static,
or processed for template expansion.

The files that are considered for template expansion must end in `*.{html,md}`
and will from here on be referred to as "template files" or "templates".

A simple "hello world" site could look something like this:

```
.
└── <site-root>/
    └── _docs/
        ├── index.html
        └── getting-started.html
```

This will give you a site with the following files in generated documentation:

```
index.html
getting-started.html
```

Scaladoc can transform both files and directories (to organize your documentation into a tree-like structure). By default, directories have a title based on the file name and have empty content. It is possible to provide index pages for each section by creating `index.html` or `index.md` (not both) in the dedicated directory.

Keep in mind that viewing your site locally with all the features it offers, like search or snippets, require a
local server. For example if your output directory was `output` you could use a python server to view everything
by doing the following and opening `localhost:8080`:

```sh
cd output
python3 -m http.server 8080
```

## Properties

Scaladoc uses the [Liquid](https://shopify.github.io/liquid/) templating engine
and provides several custom filters and tags specific to Scala
documentation.

In Scaladoc, all templates can contain YAML front-matter. The front-matter
is parsed and put into the `page` variable available in templates via Liquid.

Example front-matter

```
---
title: My custom title
---
```

Scaladoc uses some predefined properties to controls some aspects of page.

Predefined properties:

- **title** provide page title that will be used in navigation and HTML metadata.
- **extraCss** additional `.css` files that will be included in this page. Paths should be relative to the documentation root. **This setting is not exported to the template engine.**
- **extraJs** additional `.js` files that will be included in this page. Paths should be relative to the documentation root. **This setting is not exported to the template engine.**
- **hasFrame** when set to `false` page will not include default layout (navigation, breadcrumbs, etc.) but only token HTML wrapper to provide metadata and resources (js and css files). **This setting is not exported to the template engine.**
- **layout** - predefined layout to use, see below. **This setting is not exported to the template engine.**


## Using existing Templates and Layouts

To perform template expansion, Dottydoc looks at the `layout` field in the front-matter.
Here's a simple example of the templating system in action, `index.html`:

```html
---
layout: main
---

<h1>Hello world!</h1>
```

With a simple main template like this:

{% raw %}
```html
<html>
    <head>
        <title>Hello, world!</title>
    </head>
    <body>
        {{ content }}
    </body>
</html>
```

Would result in `{{ content }}` being replaced by `<h1>Hello world!</h1>` from
the `index.html` file.
{% endraw %}

Layouts must be placed in a `_layouts` directory in the site root:

```
├── _layouts
│   └── main.html
└── _docs
    ├── getting-started.md
    └── index.html
```

## Assets

In order to render assets along with static site, they need to be placed in the `_assets` directory in the site root:
```
├── _assets
│   └── images
│        └── myimage.png
└── _docs
    └── getting-started.md
```
To reference the asset on a page, one needs to create a link relative to the `_assets` directory

```
Take a look at the following image: [My image](images/myimage.png)
```

## Sidebar

By default, Scaladoc reflects the directory structure from `_docs` directory in the rendered site. There is also the ability to override it by providing a `sidebar.yml` file in the site root directory. The YAML configuration file describes the structure of the rendered static site and the table of content:

```yaml
index: index.html
subsection:
    - title: Usage
      index: usage/index.html
      directory: usage
      subsection:
        - title: Dottydoc
          page: usage/dottydoc.html
          hidden: false
        - title: sbt-projects
          page: usage/sbt-projects.html
          hidden: false
```
The root element needs to be a `subsection`.
Nesting subsections will result in a tree-like structure of navigation.

`subsection` properties are:
 - `title` - Optional string - A default title of the subsection. 
  Front-matter titles have higher priorities.
 - `index` - Optional string - A path to index page of a subsection. The path is relative to the `_docs` directory.
 - `directory` - Optional string - A name of the directory that will contain the subsection in the generated site.
  By default, the directory name is the subsection name converted to kebab case.
 - `subsection` - Array of `subsection` or `page`.

 Either `index` or `subsection` must be defined. The subsection defined with `index` and without `subsection` will contain pages and directories loaded recursively from the directory of the index page.

`page` properties are:
 - `title` - Optional string - A default title of the page. 
  Front-matter titles have higher priorities.
 - `page` - String - A path to the page, relative to the `_docs` directory.
 - `hidden` - Optional boolean - A flag that indicates whether the page should be visible in the navigation sidebar. By default, it is set to `false`.

**Note**: All the paths in the YAML configuration file are relative to `<static-root>/_docs`.

## Hierarchy of title

If the title is specified multiple times, the priority is as follows (from highest to lowest priority):

#### Page

1. `title` from the `front-matter` of the markdown/html file
2. `title` property from the `sidebar.yml` property
3. filename

#### Subsection

1. `title` from the `front-matter` of the markdown/html index file
2. `title` property from the `sidebar.yml` property
3. filename

Note that if you skip the `index` file in your tree structure or you don't specify the `title` in the frontmatter, there will be given a generic name `index`. The same applies when using `sidebar.yml` but not specifying `title` nor `index`, just a subsection. Again, a generic `index` name will appear.

## Blog
Blog feature is described in [a separate document]({% link _overviews/scala3-scaladoc/blog.md %})

## Advanced configuration
### Full structure of site root
```
.
└── <site-root>/
    ├── _layouts/
    │   └── ...
    ├── _docs/
    │   └── ...
    ├── _blog/
    │   ├── index.md
    │   └── _posts/
    │       └── ...
    └── _assets/
        ├── js/
        │   └── ...
        ├── img/
        │   └── ...
        └── ...
```
It results in a static site containing documents as well as a blog. It also contains custom layouts and assets. The structure of the rendered documentation can be based on the file system but it can also be overridden by YAML configuration.

### Mapping directory structure

Using the YAML configuration file, we can define how the source directory structure should be transformed into an outputs directory structure.

Take a look at the following subsection definition:
```yaml
- title: Some other subsection
  index: abc/index.html
  directory: custom-directory
  subsection:
    - page: abc2/page1.md
    - page: foo/page2.md
```
This subsection shows the ability of YAML configuration to map the directory structure.
Even though the index page and all defined children are in different directories, they will be rendered in `custom-directory`.
The source page `abc/index.html` will generate a page `custom-directory/index.html`, the source page `abc2/page1.md` will generate a page `custom-directory/page1.html`, 
and the source page `foo/page2.md` will generate a page `custom-directory/page2.html`.
