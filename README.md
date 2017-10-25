# Scala Documentation #

[![Build Status](https://platform-ci.scala-lang.org/api/badges/scala/docs.scala-lang/status.svg)](https://platform-ci.scala-lang.org/scala/docs.scala-lang)

This repository contains the source for the Scala documentation website, as well as the source for "Scala Improvement Process" (SIP) documents.

## Quickstart ##

To build and view the site locally:

    gem install bundler
    bundle install
    bundle exec jekyll serve -I

For more details, read on.

## Contributing ##

Please have a look at [http://docs.scala-lang.org/contribute.html](http://docs.scala-lang.org/contribute.html) before making a contribution.
This document gives an overview of the type of documentation contained within the Scala Documentation repository and the repository's structure.

Small changes, or corrected typos will generally be pulled in right away. Large changes, like the addition of new documents, or the rewriting of
existing documents will be thoroughly reviewed-- please keep in mind that, generally, new documents must be very well-polished, complete, and maintained
in order to be accepted.

## Dependencies ##

This site uses a Jekyll, a Ruby framework. You'll need Ruby and Bundler installed; see [Jekyll installation instructions](http://jekyllrb.com/docs/installation/) for the details.

## Building & Viewing ##

cd into the directory where you cloned this repository, then install the required gems with `bundle install`. This will automatically put the gems into `./vendor/bundle`.

Start the server in the context of the bundle (use `-I` for incremental builds):

    bundle exec jekyll serve -I

`It might take around 5 minutes at first but incremental compilations will be fast.`

The generated site is available at `http://localhost:4000`

If you add `--watch` at the end of the command line above, Jekyll will automatically watch for changes on the filesystem, and regenerate the site.

If you get `incompatible encoding` errors when generating the site under Windows, then ensure that the
console in which you are running jekyll can work with UTF-8 characters. As described in the blog
[Solving UTF problem with Jekyll on Windows](http://joseoncode.com/2011/11/27/solving-utf-problem-with-jekyll-on-windows/)
you have to execute `chcp 65001`. This command is best added to the `jekyll.bat`-script.

## Markdown ##

The markdown used in this site uses [kramdown](http://kramdown.gettalong.org/) extensions.

### Markdown Editor for OSX ###

There's a free markdown editor for OSX called [Mou](http://25.io/mou/). It's quite convenient to work with, and it generates the translated Markdown in real-time alongside of your editor window, as can be seen here:

![Mou Screen Shot](http://25.io/mou/img/1.png)

## License ##

All documentation contained in this repository is licensed by EPFL under a Creative Commons Attribution-Share Alike 3.0 Unported license ("CC-BY-SA"), unless otherwise noted. By submitting a "pull request," or otherwise contributing to this repository, you implicitly agree to license your contribution under the above CC-BY-SA license. The source code of this website is licensed to EPFL under the [Scala License](http://www.scala-lang.org/node/146), unless otherwise noted.
