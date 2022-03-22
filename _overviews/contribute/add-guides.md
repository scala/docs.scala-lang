---
title: Add New Guides/Tutorials
num: 7
---

## Why Contribute New Learning Material?

As [Heather Miller writes][why-contribute], contributing to [docs.scala-lang.org][home] is
critical to making Scala accessible to newcomers, experience programmers, and anyone who is curious.
It is also a fantastic way to contribute for anyone who is comfortable using Scala, but maybe does not want to get
involved with complex tools like the compiler.

## Architecture

This documentation website is backed by an open-source [github repository](https://github.com/scala/docs.scala-lang),
and is always contribution-ready.

### Content

Currently, the _types_ of documentation supported in this repository are:

- **Guides/Overviews**: Definitive guides/overviews of specific language features. Often long, detailed documents,
  often produced by members of the Scala team. An example is the excellent [Collections][collections-overview] overview.
- **Tutorials**: Bite-size, example-rich, and concise articles meant to get a developer up to speed quickly.
- **Cheatsheets**: Quick reference of Scala syntax and behaviors.

### Implementation

The website is statically generated from [Markdown](https://en.wikipedia.org/wiki/Markdown) source using
[Jekyll](https://github.com/mojombo/jekyll), and hosted on [GitHub Pages](https://pages.github.com/).
This workflow was chosen so as to make it as easy as possible for core committers and the community alike
to produce HTML documentation, and as easy as possible to publish it in a central location.

The markdown syntax being used supports [Maruku](https://github.com/bhollis/maruku) extensions, and has automatic
syntax highlighting, without the need for any tags.

Additionally [mdoc](https://github.com/scalameta/mdoc) is used during pull requests to validate Scala code blocks.
To use this feature you must use the backtick notation as documented by mdoc. Note that only validation is done.
The output files from mdoc are not used in the building of the tutorial. Use `mdoc` or `mdoc:fail` for your code blocks.

## Submitting Docs

For one to contribute a document, one must simply
[fork](https://help.github.com/articles/fork-a-repo/) the
[repo](https://github.com/scala/docs.scala-lang), write their article in
[Markdown](https://daringfireball.net/projects/markdown/syntax) (example below), and submit a pull request. That's it.
Likely after some edits and discussion, your document will be made live
on [docs.scala-lang.org][home].

    ---
    layout: overview
    title: My Awesome Title
    ---

    ## An h2 Header in Markdown

    And a paragraph, with a [link](https://www.scala-lang.org).

One can contribute code in a markdown document by either
      - indenting it by 4 spaces
      - surrounding by triple backticks, as shown below
      - in-line by putting backticks around it, e.g. `def foo`.

    ```scala
    println("hello")
    ```

Everything else is automatically generated for you; tables of contents, and most index pages. And of course, the
styling is already taken care of for you.

### Criteria for Docs to be Accepted

The goal of this documentation repository is to be tighter and more organized than other community-driven documentation platforms, like wikis. As such, any document pulled in for inclusion on
[docs.scala-lang.org][home] must:

- **"fit in"** to the repository ( _i.e.,_ it should not be a complete duplicate of another article),
- **be polished** it must be thorough, complete, correct, organized, and "article-like" (personal programming notes
don't quite fit.)
- **be maintained** if the document might require revisions from time to time, be prepared to keep it up to date, or
nominate someone to take ownership.

If you have something you're thinking about contributing, or that you're thinking about writing in order to contribute
-- we'd love to consider it! Please don't hesitate to use GitHub issues and pull requests and the
\#scala-contributors room [on Discord](https://discord.com/invite/scala) for any questions, concerns,
clarifications, etc.

## Document Templates

> **Note:** These templates will soon change slightly as a result of necessary refactoring.

### Guides/Overviews

A guide or an overview that can be logically placed on **one** page must be placed in the directory
`_overviews/RELEVANT-CATEGORY/_posts` with the file name in the format `YYYY-MM-dd-title-separated-by-dashes.md`,
and header:

    ---
    layout: overview
    title: YOUR TITLE
    ---

The rest of the document should, of course, be written in [Markdown](https://en.wikipedia.org/wiki/Markdown).

At the moment, `RELEVANT-CATEGORY` corresponds to only a single category, "core," because we are currently focusing on
building up documentation of core libraries. However, expect more categories here in the future.

If your document consists of **multiple** pages, like the [Collections][collections-overview] overview, an ordering
must be specified, by numbering documents in their logical order with `num`, and a name must be assigned to the
collection of pages using `partof`. For example, the following header might be used for a document in the collections
overview:

    ---
    layout: overview
    title: YOUR TITLE

    partof: collections
    num: 10
    ---

A **single** document in the collection must contain a tag in the header, `outof`, that indicates the total number of
documents in the large overview. Putting it on the last page in the overview is often best:

    ---
    layout: overview
    title: YOUR TITLE

    partof: collections
    num: 15
    outof: 15
    ---

Index pages, such as [docs.scala-lang.org/overviews/index.html][overviews-index] are
generated, by reading data from a configuration file, such as `_data/overviews.yml`, so your overview should be
placed into a category there.

### Tutorials

At the moment, tutorials are written the same as Guides/Overviews, except that their link must be added to
the metadata of `/tutorials.md`. e.g. for the [Scala With Maven][scala-with-maven] tutorial, the
metadata of `/tutorials.md` looks like

    ---
    layout: inner-page-parent
    title: Tutorials

    tutorials:
    ...
    - title: "Scala with Maven"
    url: "/tutorials/scala-with-maven.html"
    description: "Create a Scala project with Maven."
    icon: code
    ---

For a single-page tutorial, the typical directory to place them in is `_overviews/tutorials`.

### Cheatsheets

For now, cheatsheets are assumed to be in the form of tables. To contribute a cheatsheet, one must simply produce their
cheatsheet as a Markdown table, with the following header:

    ---
    layout: cheatsheet
    title: YOUR TITLE
    by: YOUR NAME
    about: SOME TEXT ABOUT THE CHEAT SHEET.
    ---

### Code blocks

The site build process uses [mdoc](https://scalameta.org/mdoc/) to typecheck
code snippets in markdown. This is a great way to ensure the code snippets that
you're including typecheck and are valid. Here are a few quick types to get
started.

To get started, add `mdoc` after `scala` when you are creating a
code block. The `mdoc` modifier here will make sure that `mdoc` runs the code
snippet and ensures that it's valid.

    ```scala mdoc
    val a = 1
    ```
If you have a snippet that you expect to fail, you can also account for this by
using `mdoc:fail` for a compile error `mdoc:crash` for a runtime-error.

    ```scala mdoc:fail
    val b: String = 3 // won't compile
    ```
Keep in mind that a single file is all compiled as a single unit, so you can't
redefine a variable that was defined above in another code snippet. _However_
there are a couple ways to get around this. Firstly, you can use the `mdoc:nest`
modifier with will wrap the snippet in a `scala.Predef.locally{...}`. This will
essentially "hide" the snippet from the others. Another way around this is to
use the `mdoc:reset` modifier, which _resets_ and forgets about everything up
above. Here is an example using the various modifiers.

    ```scala mdoc
    import java.time.Instant

    def now() = Instant.now()
    object Foo {}
    ```

    ```scala mdoc:nest
    case class Foo(a: Int) // conflicts with Foo above, but it's nested so it's fine
    ```

    ```scala mdoc
    val a = s"The time is ${now()}" // still have access to the now method from above
    ```
    ```scala mdoc:reset
    case class Foo(a: String) // forget the previous Foo's and start fresh
    ```
    ```scala mdoc
    val myFoo = Foo("hi") // now we only have access to the last Foo
    ```

[collections-overview]: {% link _overviews/collections-2.13/introduction.md %}
[scala-with-maven]:  {% link _overviews/tutorials/scala-with-maven.md %}
[why-contribute]: {% link contribute.md %}
[home]: {% link index.md %}
[overviews-index]: {% link _overviews/index.md %}
