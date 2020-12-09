---
layout: contribute
title: Contribute
---

###### Heather Miller

## A Place to Build Documentation Together

[docs.scala-lang.org](https://docs.scala-lang.org) was intended to make it easier for the Scala team and the community at large to easily collect, organize, and "make public" many different types of documentation while making it easy for users to find, interact, and help us improve that documentation.

This website is an open-source repository of official Scala documentation, hosted on [github](https://github.com/scala/docs.scala-lang), that is always ready for contributions.

### A Need for Better Documentation

The availability, depth, and quality of documentation is considered by many to be a huge issue.

As Scala continues to mature, it continues to attract more and more interested newcomers and potential adopters who are well accustomed to easy-to-find, abundant, quality documentation (found in other languages, like Java). For many, the learning curve becomes unnecessarily steep, and [people sometimes get frustrated](https://groups.google.com/group/scala-user/browse_thread/thread/29996782cb8428cd/5ade8462ba30b177).

If we want Scala to be accessible to more programmers, clear, easy-to-find documentation is essential.

If you're interested in contributing to the Scala project in general, I argue that one of the most meaningful ways that you can, is to help us improve this transfer of information- let's make it easier and faster for people to _get_ core concepts, and to answer their own questions so they can progress to _Scala-proficient_ quickly. Each line that you contribute has the potential to affect the entire Scala community as a whole-- current, and future.

## About docs.scala-lang.org

### Content

Currently, the _types_ of documentation supported in this repository are:

- **Guides/Overviews**: Definitive guides/overviews of specific language features. Often long, detailed documents, often produced by members of the Scala team. An example is the excellent [Collections]({{ site.baseurl }}/overviews/collections-2.13/introduction.html) overview.
- **Tutorials**: Bite-size, example-rich, and concise articles meant to get a developer up to speed quickly.
- **Cheatsheets**: Quick reference of Scala syntax and behaviors.

### Implementation

This documentation repository is open-source, it lives in [github repository](https://github.com/scala/docs.scala-lang), and is always contribution-ready.

It's statically generated from [Markdown](https://en.wikipedia.org/wiki/Markdown) source using [Jekyll](https://github.com/mojombo/jekyll), and hosted on [GitHub Pages](https://pages.github.com/). This workflow was chosen so as to make it as easy as possible for core committers and the community alike to produce HTML documentation, and as easy as possible to publish it in a central location.

The markdown syntax being used supports [Maruku](https://github.com/bhollis/maruku) extensions, and has automatic syntax highlighting, without the need for any tags.

Additionally [tut](https://github.com/tpolecat/tut) is used during pull requests to validate Scala code blocks. To use this feature you must use the backtick notation as documented by tut. Note that only validation is done. The output files from tut are not used in the building of the tutorial. Either use `tut` or `tut:fail` for your code blocks.

## Submitting Docs

For one to contribute a document, one must simply
[fork](https://help.github.com/articles/fork-a-repo/) the
[repo](https://github.com/scala/docs.scala-lang), write their article in
[Markdown](https://daringfireball.net/projects/markdown/syntax) (example below), and submit a pull request. That's it. Likely after some edits and discussion, your document will be made live on [docs.scala-lang.org](https://docs.scala-lang.org).

    ---
    layout: overview
    title: My Awesome Title
    ---

    ## An h2 Header in Markdown

    And a paragraph, with a [link](https://www.scala-lang.org).

	One can contribute code by indenting it 4 spaces, or in-line by putting backticks around it like so, `def foo`

Everything else is automatically generated for you; tables of contents, and most index pages. And of course, the styling is already taken care of for you.

### Criteria for Docs to be Accepted

The goal of this documentation repository is to be tighter and more organized than other community-driven documentation platforms, like wikis. As such, any document pulled in for inclusion on [https://docs.scala-lang.org](https://docs.scala-lang.org) must:

- **"fit in"** to the repository ( _i.e.,_ it should not be a complete duplicate of another article),
- **be polished** it must be thorough, complete, correct, organized, and "article-like" (personal programming notes don't quite fit.)
- **be maintained** if the document might require revisions from time to time, it should come with an owner

If you have something you're thinking about contributing, or that you're thinking about writing in order to contribute-- we'd love to consider it! Please don't hesitate to use GitHub issues and pull requests and the [scala/contributors room](https://gitter.im/scala/contributors) on Gitter for any questions, concerns, clarifications, etc.

## Document Templates

<div class="alert-message info">
  <p><strong>Note:</strong> These templates will soon change slightly as a result of necessary refactoring.</p>
</div>

### Guides/Overviews

A guide or an overview that can be logically placed on **one** page must be placed in the directory `overviews/RELEVANT-CATEGORY/_posts` with the file name in the format `YYYY-MM-dd-title-separated-by-dashes.md`, and header:

    ---
    layout: overview
    title: YOUR TITLE
    ---

The rest of the document should, of course, be written in [Markdown](https://en.wikipedia.org/wiki/Markdown).

At the moment, `RELEVANT-CATEGORY` corresponds to only a single category, "core," because we are currently focusing on building up documentation of core libraries. However, expect more categories here in the future.

If your document consists of **multiple** pages, like the [Collections]({{ site.baseurl }}/overviews/collections-2.13/introduction.html) overview, an ordering must be specified, by numbering documents in their logical order with `num`, and a name must be assigned to the collection of pages using `partof`. For example, the following header might be used for a document in the collections overview:

    ---
    layout: overview
    title: YOUR TITLE

    partof: collections
    num: 10
    ---

A **single** document in the collection must contain a tag in the header, `outof`, that indicates the total number of documents in the large overview. Putting it on the last page in the overview is often best:

    ---
    layout: overview
    title: YOUR TITLE

    partof: collections
    num: 15
    outof: 15
    ---

Index pages, such as [https://docs.scala-lang.org/overviews/index.html](https://docs.scala-lang.org/overviews/index.html) are automatically generated, assuming documents are properly placed under the correct `RELEVANT-CATEGORY`. So, simply drop your document into the correct folder, and you're done.

### Tutorials

At the moment, a tutorial that can be logically placed on **one** page must be placed in the directory `tutorials/` with the file name in the format `title-separated-by-dashes.md`. For the moment, single-page tutorials use the same layout as single-page overviews:

    ---
    layout: overview
    title: YOUR TITLE
    ---

If you have a **multiple-page** tutorial, like in the case of multiple-page overviews, you must both specify an ordering for your document, and a name must be assigned to the collection of tutorial pages. For example, the following header is used for the [Tour of Scala]({{ site.baseurl }}/tour/tour-of-scala.html) series of tutorial articles:

    ---
    layout: inner-page-no-masthead
    title: YOUR TITLE

    tutorial: scala-tour
    num: 4
    ---

At the moment, only indexes for multiple-page tutorials are automatically generated.

### Cheatsheets

For now, cheatsheets are assumed to be in the form of tables. To contribute a cheatsheet, one must simply produce their cheatsheet as a Markdown table, with the following header:

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

To get started, you can simply add `mdoc` behind `scala` when you are creating a
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
