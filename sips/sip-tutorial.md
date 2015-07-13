---
layout: sip-landing
title: Writing a new SIP
---

This tutorial details of how to write a new SIP and adding it to the website.   Currently two mechanisms of providing a new SIP are recommended:

* Using Markdown
* Using Google Docs.


## Writing a SIP in Markdown ##

First, create a new SIP file in the `pending/_posts` directory.  Make sure the new file follows the format:  `YYYY-MM-dd-{title}.md`.  Where:
* `YYYY` is the current year when the proposal originated.
* `MM` is the current month (`01` = January, `12` = December) when the proposal originated.
* `dd` is the day of the month when the proposal originated.
* `{title}` is the title for the SIP.


### Markdown formatting ###

Use the [Markdown Syntax](http://daringfireball.net/projects/markdown/syntax) to write your SIP.

If you would like a starting point, clone the [SIP Template](./sip-template.html) in
`sips/pending/sip-template.md` and use that.

See the [source](https://github.com/scala/scala.github.com/blob/gh-pages/sips/sip-tutorial.md) for this document (`sip-tutorial.md`) for how to do syntax highlighting.

{% highlight scala %}
class Foo
{% endhighlight %}


## Testing changes ##

Testing changes requires installing [Jekyll](http://jekyllrb.com/docs/installation/). Since this site is hosted on github pages, make sure you have [whatever version of Jekyll that github is running](https://help.github.com/articles/using-jekyll-with-pages#troubleshooting). As of the writing of this README, that is version >= 1.0.x.

Use the `jekyll server` command to start up a local server.  You can then view your changes at [http://localhost:4000/sips](http://localhost:4000/sips).
