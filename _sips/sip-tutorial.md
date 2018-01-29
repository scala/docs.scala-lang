---
layout: sips
title: Writing a new SIP
---

This tutorial details of how to write a new SIP and adding it to the website.

## How do I submit? ##

The process to submit is simple:

* Fork the [Scala documentation repository](http://github.com/scala/docs.scala-lang) and clone it.
* Create a new SIP file in the `sips/pending/_posts/`. Use the [S(L)IP template](https://github.com/scala/docs.scala-lang/blob/master/_sips/sip-template.md)
  * Make sure the new file follows the format:  `YYYY-MM-dd-{title}.md`.  Use the proposal date for `YYYY-MM-dd`.
  * Use the [Markdown Syntax](http://daringfireball.net/projects/markdown/syntax) to write your SIP.
  * Follow the instructions in the [README](https://github.com/scala/docs.scala-lang/blob/master/README.md) to build your SIP locally so you can ensure that it looks correct on the website.
* Create a link to your SIP in the "pending sips" section of `index.md`.
* Commit your changes and push them to your forked repository.
* Create a new pull request. This will notify the Scala SIP team.


## SIP Post Format ##

First, create a new SIP file in the `pending/_posts` directory.  Make sure the new file follows the format:  `YYYY-MM-dd-{title}.md`.  Where:
* `YYYY` is the current year when the proposal originated.
* `MM` is the current month (`01` = January, `12` = December) when the proposal originated.
* `dd` is the day of the month when the proposal originated.
* `{title}` is the title for the SIP.

### Markdown formatting ###

Use the [Markdown Syntax](http://daringfireball.net/projects/markdown/syntax) to write your SIP.

If you would like a starting point, clone the [SIP Template](./sip-template.html) in
`sips/pending/sip-template.md` and use that.

See the [source](https://github.com/scala/docs.scala-lang/blob/master/_sips/sip-template.md) for this document (`sip-tutorial.md`) for how to do syntax highlighting.

{% highlight scala %}
class Foo
{% endhighlight %}


## Testing changes ##

Testing changes requires installing [Jekyll](http://jekyllrb.com/docs/installation/). Since this site is hosted on github pages, make sure you have [whatever version of Jekyll that github is running](https://help.github.com/articles/using-jekyll-with-pages#troubleshooting). As of the writing of this README, that is version >= 1.0.x.

After the installation, you need to start up the local server. The
[README](https://github.com/scala/docs.scala-lang/blob/master/README.md) gives
a concise explanation on how to do it. When the server is running, view your
changes at [http://localhost:4000/sips](http://localhost:4000/sips).
