---
layout: singlepage-overview
title: New features for Scaladoc
partof: scala3-scaladoc
languages: ["uk"]
---

The new Scala version 3 comes with a completely new implementation of the documentation generator _Scaladoc_, rewritten from scratch. 
In this article you can find highlights of new features that are or will be introduced to Scaladoc.
For general reference, visit [Scaladoc manual]({% link _overviews/scala3-scaladoc/index.md %}).

## New features

### Markdown syntax

The biggest change introduced in the new version of Scaladoc is the change of the default language for docstrings. So far Scaladoc only supported Wikidoc syntax.
The new Scaladoc can still parse legacy `Wikidoc` syntax, however Markdown has been chosen as a primary language for formatting comments.
To switch back to `Wikidoc` one can pass a global flag before running the `doc` task or one can define it for specific comments via the `@syntax wiki` directive.

For more information on how to use the full power of docstings, check out [Scaladoc docstrings][scaladoc-docstrings]


### Static site

Scaladoc also provides an easy way for creating **static sites** for both documentation and blog posts in the similar way as Jekyll does.
Thanks to this feature, you can store your documentation along-side with the generated Scaladoc API in a very convenient way.

For more information on how to configure the generation of static sites check out [Static documentation][static-documentation] chapter

![](../../resources/images/scala3/scaladoc/static-site.png)

### Blog posts

Blog posts are a specific type of static sites. In the Scaladoc manual you can find additional information about how to work with [blog posts][built-in-blog].

![](../../resources/images/scala3/scaladoc/blog-post.png)

### Social links

Furthermore, Scaladoc provides an easy way to configure your [social media links][social-links] e.g. Twitter or Discord.

![](../../resources/images/scala3/scaladoc/social-links.png){: style="width: 180px"}

## Experimental features

The following features are currently (May 2021) not stable to be released with scaladoc, however we are happy to hear your feedback. Each feature has its own thread at scala-lang contributors site, where you can share your opinions.

### Snippet compiling

One of the experimental features of Scaladoc is a snippets' compiler. This tool will allow you to compile snippets that you attach to your docstring
to check that they actually behave as intended, e.g., to properly compile. This feature is very similar to the `tut` or `mdoc` tools, 
but will be shipped with Scaladoc out of the box for easy setup and integration into your project. Making snippets interactive---e.g., letting users edit and compile them in the browser---is under consideration, though this feature is not in scope at this time.

Showcase:
* Hiding code ![]({{ site.baseurl }}/resources/images/scala3/scaladoc/hiding-code.gif)
* Assert compilation errors ![]({{ site.baseurl }}/resources/images/scala3/scaladoc/assert-compilation-errors.gif)
* Snippet includes ![]({{ site.baseurl }}/resources/images/scala3/scaladoc/snippet-includes.png)

For more information see [Guides](/scala3/guides/scaladoc/snippet-compiler.html), or follow this [Scala Contributors thread](https://contributors.scala-lang.org/t/snippet-validation-in-scaladoc-for-scala-3/4976)

### Type-based search

Searching for functions by their symbolic names can be time-consuming.
That is why the new scaladoc allows you to search for methods and fields by their types.


So, for a declaration:
```
extension [T](arr: IArray[T]) def span(p: T => Boolean): (IArray[T], IArray[T]) = ...
```
Instead of searching for `span` we can also search for `IArray[A] => (A => Boolean) => (IArray[A], IArray[A])`.

To use this feature simply type the signature of the function you are looking for in the scaladoc searchbar. This is how it works:

![](../../resources/images/scala3/scaladoc/inkuire-1.0.0-M2_js_flatMap.gif)

This feature is provided by the [Inkuire](https://github.com/VirtusLab/Inkuire) search engine, which works for Scala 3 and Kotlin. To be up-to-date with the development of this feature, follow the [Inkuire repository](https://github.com/VirtusLab/Inkuire).

For more information see [Guides](/scala3/guides/scaladoc/search-engine.html)

Note that this feature is still in development, so it can be subject to considerable change.
If you encounter a bug or have an idea for improvement, don't hesitate to create an issue on [Inkuire](https://github.com/VirtusLab/Inkuire/issues/new) or [dotty](https://github.com/lampepfl/dotty/issues/new).

[scaladoc-docstrings]: {% link _overviews/scala3-scaladoc/docstrings.md %}
[static-documentation]: {% link _overviews/scala3-scaladoc/static-site.md %}
[built-in-blog]: {% link _overviews/scala3-scaladoc/blog.md %}
[social-links]: {% link _overviews/scala3-scaladoc/settings.md %}#-social-links
