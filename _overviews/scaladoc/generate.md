---
layout: multipage-overview
title: Generating Scaladoc
partof: scaladoc
overview-name: Scaladoc
num: 4
permalink: /overviews/scaladoc/:title.html
---

There are two ways to generate API documentation in HTML from your Scala code.  Those options are:

* use sbt to do it,
* use the scaladoc command-line tool.

## Using sbt

The easiest and most commonly used way to generate API documentation from your Scala code is with the build tool [sbt](https://www.scala-sbt.org).

In the sbt shell, generate Scaladoc by running `doc`:

    > doc
    [info] Main Scala API documentation to target/scala-2.12/api...
    [info] model contains 1 documentable templates
    [info] Main Scala API documentation successful.
    [success] Total time: 20 s

The HTML documentation will show up in the respective `target/` directory (or directories for builds with multiple projects) that sbt prints to the console output.

For more information on using sbt on your system, see the [download instructions](https://www.scala-lang.org/download/) for [getting started with Scala and sbt on the command line]({{site.baseurl}}/getting-started/sbt-track/getting-started-with-scala-and-sbt-on-the-command-line.html).

For additional information about configuring Scaladoc in sbt, see the [Generate API documentation](https://www.scala-sbt.org/1.x/docs/Howto-Scaladoc.html) section of the sbt reference manual.

## Using scaladoc command

If you use Scala commands directly to start a console with `scala` or compile with `scalac`, then you should have a `scaladoc` command-line utility, as well. The `scaladoc` command can also be installed using Coursier: `coursier install scaladoc`. Using the command-line utility is a more advanced and less commonly used method of generating Scaladoc.

    $ scaladoc src/main/scala/App.scala
    model contains 1 documentable templates

This will put the HTML in the current directory.  This is probably not what you want.  It's preferable to output to a subdirectory.   To specify a different target directory, use the `-d` command-line option:

    $ scaladoc -d build/ src/main/scala/App.scala

For more information on the `scaladoc` command and what other command-line options it supports, see the `scaladoc --help`.

This command is harder to operate with more complex projects containing both multiple Scala source files and library dependencies.  This is why using sbt (see above) is easier and better suited for generating Scaladoc.

The Scaladoc command exists because it preceded the development of sbt, but also because it is useful to the Scala development team with studying bug reports for Scaladoc.

More information on directly using the Scala commands, like `scaladoc`, is discussed at [your first Scala program](https://docs.scala-lang.org/scala3/book/taste-hello-world.html).

