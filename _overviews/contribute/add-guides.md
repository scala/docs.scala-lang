---
title: Add New Guides/Tutorials
num: 8
---

## Why Contribute New Learning Material?

As [Heather Miller writes][why-contribute], contributing to [docs.scala-lang.org][home] is
critical to making Scala accessible to newcomers, experienced programmers, and anyone who is curious.
It is also a fantastic way to contribute for anyone who is comfortable using Scala, but maybe does not want to get
involved with complex tools like the compiler.

## Architecture

This documentation website is backed by an open-source [GitHub repository](https://github.com/scala/docs.scala-lang),
and is always contribution-ready.

### Content

Currently, the _types_ of documentation supported in this repository are:

- **Guides/Overviews/Books**: Definitive guides/overviews of specific language features. Often long, detailed documents,
  often produced by members of the Scala team. An example is the [Collections][collections-overview] overview.
- **References**: The canonical reference for language features, written by members of the Scala team.
  These provide the exact specification to understand more subtle aspects of the language. An example is the
  [Scala 3 reference][scala-3-reference].
- **Tutorials**: Bite-size, example-rich, and concise articles meant to get a developer up to speed quickly.
- **Cheatsheets**: Quick reference of Scala syntax and behaviors.

### Implementation

The website is statically generated from [Markdown](https://en.wikipedia.org/wiki/Markdown) source using
[Jekyll](https://github.com/mojombo/jekyll), and hosted on [GitHub Pages](https://pages.github.com/).
This workflow was chosen to help contributors to focus on writing helpful content, rather than on configuration and
boilerplate. It also aids publishing a static site in a central location.

The Markdown syntax being used supports [Maruku](https://github.com/bhollis/maruku) extensions, and has automatic
syntax highlighting, without the need for any tags.

Additionally, [mdoc](https://github.com/scalameta/mdoc) is used during pull requests to validate Scala code blocks.
To use this feature you must use the backtick notation as documented by mdoc,
[see here](#code-blocks) for an example.

**Note:** only validation of code is done by mdoc, and no extra output is generated.

## Submitting Docs

To contribute a new document, you should first
[fork](https://help.github.com/articles/fork-a-repo/) the
[repo](https://github.com/scala/docs.scala-lang), then write your article in
[Markdown](https://daringfireball.net/projects/markdown/syntax) (example below), and finally submit a pull request.
Likely after some edits and discussion, your document will be made live
on [docs.scala-lang.org][home].

    ---
    layout: singlepage-overview
    title: My Awesome Title
    ---

    ## An h2 Header in Markdown

    And a paragraph, with a [link](https://www.scala-lang.org).

Tables of contents will be automatically generated in a sidebar for your document, and syntax highlighting
is provided.

### Criteria for Docs to be Accepted

The goal of this documentation repository is to be highly curated, rather than the approach by other community-driven
documentation platforms, like wikis. Therefore, to be included on [docs.scala-lang.org][home], a document must:

- **"fit in"** to the repository (_i.e.,_ it should not be a complete duplicate of another article),
- **be polished**, i.e. it must be thorough, complete, correct, and organized; written as an article to be understood
  by many users.
- **be maintained**, if the document might require revisions from time to time, be prepared to keep it up to date, or
nominate someone to take ownership.

If you have something you're thinking about contributing, or that you're thinking about writing in order to contribute
-- we'd love to consider it! Please don't hesitate to use GitHub issues and pull requests and the
`#scala-contributors` room [on Discord](https://discord.com/invite/scala) for any questions, concerns,
clarifications, etc.

## Code blocks

It's common for various kinds of documents to require code examples.
You can contribute code in a markdown document by either
- in-line by putting backticks around it,
- surrounding by triple backticks,
- or indenting it by 4 spaces, e.g.:

~~~
inline example: `val x = 23`

block example:
```scala
println("hello")
```

indented example:

    case class Foo(x: Int)
~~~

### Scala 2 vs Scala 3

Sometimes you would like to compare between Scala 2 and Scala 3 in a document, for example in
our [Hello World][hello-world] chapter of the Scala Book. Here is an example of how you
can generate the same tabs in markdown with the `tabs` directive and class `tabs-scala-version`:

<!-- {% raw  %} -->
~~~liquid
{% tabs hello-world-demo class=tabs-scala-version %}

{% tab 'Scala 2' for=hello-world-demo %}
```scala
object hello extends App {
  println("Hello, World!")
}
```
{% endtab %}

{% tab 'Scala 3' for=hello-world-demo %}
```scala
@main def hello() = println("Hello, World!")
```
{% endtab %}

{% endtabs %}
~~~
<!-- {% endraw  %} -->

It is crucial that you use the `tabs-scala-version` class to benefit from some cool user interactions:
- all other Scala version tabs on the same page will also switch to current tab, whenever one is changed.
- the tab picked will be remembered across the site, and when the user returns to the page after some time.

For code snippets that are valid in both Scala 2 and Scala 3, please use a single tab labelled
“Scala 2 and 3” (please note that the `tabs-scala-version` class is also dropped):

<!-- {% raw  %} -->
~~~liquid
{% tabs scala-2-and-3-demo %}
{% tab 'Scala 2 and 3' for=scala-2-and-3-demo %}
```scala
List(1, 2, 3).map(x => x + 1).sum
```
{% endtab %}
{% endtabs %}
~~~
<!-- {% endraw  %} -->

### Typechecked Examples

The site build process uses [mdoc](https://scalameta.org/mdoc/) to typecheck
code snippets in markdown. This is a great way to ensure the code snippets that
you're including typecheck and are valid. Here are a few quick tips to get
started:

First, add `mdoc` after `scala` when you are creating a
code block. The `mdoc` modifier here will make sure that `mdoc` runs the code
snippet and ensures that it's valid.

<div class="language-plaintext highlighter-rouge">
    <div class="highlight">
        <pre class="highlight">
            <code class="hljs scala">&#96;&#96;&#96;scala mdoc
<span class="hljs-keyword">val</span> a = <span class="hljs-number">1</span>
```</code></pre></div></div>

If you have a snippet that you expect to fail, you can also account for this by
using `mdoc:fail` for a compile error `mdoc:crash` for a runtime-error.

<div class="language-plaintext highlighter-rouge"><div class="highlight"><pre class="highlight"><code class="hljs scala">&#96;&#96;&#96;scala mdoc:fail
<span class="hljs-keyword">val</span> b: <span class="hljs-type">String</span> = <span class="hljs-number">3</span> <span class="hljs-comment">// won't compile</span>
```</code></pre></div></div>

Keep in mind that a single file is all compiled as a single unit, so you can't
redefine a variable that was defined above in another code snippet. _However_
there are a couple ways to get around this. Firstly, you can use the `mdoc:nest`
modifier with will wrap the snippet in a `scala.Predef.locally{...}`. This will
essentially "hide" the snippet from the others. Another way around this is to
use the `mdoc:reset` modifier, which _resets_ and forgets about everything up
above. Here is an example using the various modifiers.

<div class="language-plaintext highlighter-rouge"><div class="highlight"><pre class="highlight"><code class="hljs scala">&#96;&#96;&#96;scala mdoc
<span class="hljs-keyword">import</span> java.time.<span class="hljs-type">Instant</span>

<span class="hljs-function"><span class="hljs-keyword">def</span> <span class="hljs-title">now</span></span>() = <span class="hljs-type">Instant</span>.now()
<span class="hljs-class"><span class="hljs-keyword">object</span> <span class="hljs-title">Foo</span> </span>{}
```</code></pre></div></div>

<div class="language-plaintext highlighter-rouge"><div class="highlight"><pre class="highlight"><code class="hljs scala">&#96;&#96;&#96;scala mdoc:nest
<span class="hljs-keyword">case</span> <span class="hljs-class"><span class="hljs-keyword">class</span> <span class="hljs-title">Foo</span>(<span class="hljs-params">a: <span class="hljs-type">Int</span></span>) <span class="hljs-comment">// conflicts with Foo above, but it's nested so it's fine</span></span>
```</code></pre></div></div>

<div class="language-plaintext highlighter-rouge"><div class="highlight"><pre class="highlight"><code class="hljs scala">&#96;&#96;&#96;scala mdoc
<span class="hljs-keyword">val</span> a = <span class="hljs-string">s"The time is <span class="hljs-subst">${now()}</span>"</span> <span class="hljs-comment">// still have access to the now method from above</span>
```</code></pre></div></div>

<div class="language-plaintext highlighter-rouge"><div class="highlight"><pre class="highlight"><code class="hljs scala">&#96;&#96;&#96;scala mdoc:reset
<span class="hljs-keyword">case</span> <span class="hljs-class"><span class="hljs-keyword">class</span> <span class="hljs-title">Foo</span>(<span class="hljs-params">a: <span class="hljs-type">String</span></span>) <span class="hljs-comment">// forget the previous Foo's and start fresh</span></span>
```</code></pre></div></div>

<div class="language-plaintext highlighter-rouge"><div class="highlight"><pre class="highlight"><code class="hljs scala">&#96;&#96;&#96;scala mdoc
<span class="hljs-keyword">val</span> myFoo = <span class="hljs-type">Foo</span>(<span class="hljs-string">"hi"</span>) <span class="hljs-comment">// now we only have access to the last Foo</span>
```</code></pre></div></div>

## Document Templates

### Guides/Overviews

A guide or an overview that can be logically placed on **one** markdown page should be placed in the directory
`_overviews/RELEVANT-CATEGORY/`. It should have the header:

    ---
    layout: singlepage-overview
    title: YOUR TITLE
    ---

The rest of the document will be written in [Markdown](https://en.wikipedia.org/wiki/Markdown) syntax.

You may substitute `RELEVANT-CATEGORY` for any directory that is related, or create a new one if one is not suitable.

If your guide/overview consists of **multiple** pages, like the [Collections][collections-overview] overview,
an ordering must be specified, by numbering documents in their logical order with the `num` tag in the header,
and a name must be assigned to the collection of pages using the `partof` tag.
For example, the following header might be used for a document in the collections overview:

    ---
    layout: multipage-overview
    title: YOUR TITLE

    partof: collections
    num: 10
    ---

**At least one** document in the collection must contain a tag in the header, `outof`, that indicates the total number
of documents in the large overview. Putting it on the last page in the overview is often best:

    ---
    layout: multipage-overview
    title: YOUR TITLE

    partof: collections
    num: 15
    outof: 15
    ---

Index pages, such as [docs.scala-lang.org/overviews/index.html][overviews-index] are
generated by reading data from a configuration file, such as `_data/overviews.yml`, so your overview should be
placed into a category there.

### Tutorials

Tutorials are different to guides, they should be written in a much more concise, task-oriented style,
usually on a single page.

Similar to guides, tutorials also use the same markdown header.

Once the tutorial is written, to aid user navigation their link must be added to
the metadata of `/tutorials.md`. e.g. it could look like

    ---
    layout: inner-page-parent
    title: Tutorials

    tutorials:
    ...
    - title: My New Tutorial
      url: "/tutorials/my-new-tutorial.html"
      description: "Learn How To Do This Specific Task"
      icon: code
    ---

You must also add the tutorial to the drop-down list in the navigation bar. To do this, add an extra entry to
`_data/doc-nav-header.yml`. i.e.

    ---
    - title: Getting Started
      url: "/getting-started/index.html"
    - title: Learn
      ...
    - title: Tutorials
      url: "#"
      submenu:
      ...
      - title: My New Tutorial
        url: "/tutorials/my-new-tutorial.html"
    ...
    ---

### Cheatsheets

Cheatsheets have a special layout, and the content is expected to be a Markdown table. To contribute a cheatsheet,
you should use the following format:

    ---
    layout: cheatsheet
    title: YOUR TITLE
    by: YOUR NAME
    about: SOME TEXT ABOUT THE CHEAT SHEET.
    ---
    | Title A | Title B |
    |---------|---------|
    | content | more    |

[collections-overview]: {% link _overviews/collections-2.13/introduction.md %}
[why-contribute]: {% link contribute.md %}
[home]: {% link index.md %}
[overviews-index]: {% link _overviews/index.md %}
[scala-3-reference]: {{ site.scala3ref }}
[hello-world]: {% link _overviews/scala3-book/taste-hello-world.md %}
