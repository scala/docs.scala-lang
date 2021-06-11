---
layout: sips
title: Writing a new SIP
---

This tutorial details of how to write a new SIP and adding it to the website.

## How do I submit? ##

The process to submit is simple:

* Fork the [Scala documentation repository](https://github.com/scala/docs.scala-lang) and clone it.
* Create a new SIP file in the `_sips/sips`. Use the [SIP template](https://github.com/scala/docs.scala-lang/blob/main/_sips/sip-template.md)
  * Make sure the new file follows the format: `YYYY-MM-dd-{title}.md`. Use the proposal date for `YYYY-MM-dd`.
  * Use the [Markdown Syntax](https://daringfireball.net/projects/markdown/syntax) to write your SIP.
  * Follow the instructions in the [README](https://github.com/scala/docs.scala-lang/blob/main/README.md) to build your SIP locally so you can ensure that it looks correct on the website.
* Create a link to your SIP in the "pending sips" section of `index.md`.
* Commit your changes and push them to your forked repository.
* Create a new pull request. This will notify the Scala SIP team.


## SIP Post Format ##

First, create a new SIP file in the `_sips/sips` directory. Make sure the new file follows the format: `YYYY-MM-dd-{title}.md`. Where:
* `YYYY` is the current year when the proposal originated.
* `MM` is the current month (`01` = January, `12` = December) when the proposal originated.
* `dd` is the day of the month when the proposal originated.
* `{title}` is the title for the SIP.

### Markdown formatting ###

Use the [Markdown Syntax](https://daringfireball.net/projects/markdown/syntax) to write your SIP.

If you would like a starting point, clone the [SIP Template](./sip-template.html) in
`_sips/sip-template.md` and use that.

See the [source](https://github.com/scala/docs.scala-lang/blob/main/_sips/sip-template.md) for this document (`sip-tutorial.md`) for how to do syntax highlighting.

```scala
class Foo
```


## Testing changes ##

Testing changes requires installing [Jekyll](https://jekyllrb.com/docs/installation/). Since this site is hosted on github pages, make sure you have [whatever version of Jekyll that github is running](https://help.github.com/articles/using-jekyll-with-pages#troubleshooting). As of the writing of this README, that is version >= 1.0.x.

After the installation, you need to start up the local server. The
[README](https://github.com/scala/docs.scala-lang/blob/main/README.md) gives
a concise explanation on how to do it. When the server is running, view your
changes at [https://localhost:4000/sips](https://localhost:4000/sips).
