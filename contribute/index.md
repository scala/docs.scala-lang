---
layout: page
title: Contribute
---
# Contributing to the Scala project

The Scala programming langauge is an open source project with a very
diverse community, where people from all over the world contribute their work,
with everyone benefitting from friendly help and advice, and
kindly helping others in return. So why not join the Scala community and help
everyone make things better?

The following are typical questions you might ask when first contributing to Scala.
If you have other questions not addressed here, feel free to ask on the [scala-internals mailing list](http://groups.google.com/group/scala-internals).

<br/>

### I found something that doesn't work as expected. How to file a bug report?

[The reporting bugs page](bug-reporting-guide.html) describes the steps to take when you find something that doesn't work
as expected. Filing in a good bug report increases the chances the ticket is fixed quickly.

<br/>

### Why contribute a patch to Scala?

Just to name a few common reasons:
 - contributing a patch is the best way to make sure your desired changes will be available in the next Scala version
 - Scala is written in Scala, so going through the source code and patching it will improve your Scala-fu
 - last but not least, you will make it into the [Scala Contribuitor Hall of Fame](scala-fame.html).

<br/>

### I'd like to start hacking the Scala project, how to find something to work on?

Depending on your skillset, you may want to contribute documentation and/or code. Documentation has always been very
appreciated work in the Scala community, as most code contributions tend to be quite scarce in explanations of how
things work and how everyone else is supposed to use them. To contribute documentation, have a look at the
[documentation page](documentation.html).

The main Scala project consists of the standard Scala library, the Scala reflection and macros library,
the Scala compiler and the Scaladoc tool. This means there's plenty to choose from when deciding what to work on.
Typically the scaladoc tool provides a low entry point for new committers, so it is a good first step into contributing.

On the Scala bug tracker you will find many bugs that are [marked as good starting points to contributing ("community" bugs)](https://issues.scala-lang.org/secure/IssueNavigator.jspa?requestId=12111) or [that are not currently assigned](https://issues.scala-lang.org/secure/IssueNavigator.jspa?requestId=12112) and that you could pick up. Once you decided on a ticket to look at, see the next step on how to proceed further.

<br/>

### I have this idea that I'd like to add to Scala, how do I start?

The first step to making a change is to discuss it with the community at large, to make sure everyone agrees on the idea
and on the implementation plan. Starting point ("community") bugs are usually uncontroversial, so you can jump right
ahead to hacking the scala source tree and filing a pull request. For larger changes it is best to announce the change
on the [scala-internals](http://groups.google.com/group/scala-internals) mailing list and get developer feedback. For really complex changes, a [Scala Improvement Process (SIP)](http://docs.scala-lang.org/sips/) document might be required, but the first step is always to discuss it on the mailing list.

Contributions, big or small, simple or complex, controversial or undisputed, need to materialize as patches against
the Scala project source tree. The [hacker guide](hacker-guide.html) will explain how to materialize your idea into a full-fledged pull request against the Scala code base.

<br/>

<!--

To be moved to hacker-guide.md:

- Subpages or subsections for contributing for each project (i.e. how to find tickets/features to work on)
- Building and contributing code (contributor's workflow)
  - link to a proper git etiquette page
  - link to CLA
  - how to run and use partest
  - compiler page (links to compiler-related docs i.e. reflection/macros/compiler-plugin guides, links to compiler internal videos, and useful info from wiki) (or should this go on docs.scala-lang?)
- Link to how to make a bug report

The source code is hosted on [github](http://github.com/scala/scala).

If you're interested in joining our community and contributing to the project,
start simple- often Scaladoc (Scala's javadoc-like tool, Example: [Scala
Standard Library API](www.scala-lang.org/api/current/index.html#package)) is
the best place to get started.


## Overview of the Scala Ecosystem

[Scala Project](http://scala-lang.org)

[Typesafe Stack](http://typesafe.com/stack)

        EPFL             Typesafe Stack
     _______________      ___________
    |               |    |           |
    | stdlib        |    |  Akka     |
    | compiler      |    |  Play!    |
    | scaladoc      |    |  SBT      |
    | documentation |    |  ....     |
    |_______________|    |___________|


## Basic Workflow

The Scala project, including the compiler, standard library and Scaladoc is hosted on [https://github.com/scala/scala](). As usual on github, developers work in personal forks that are merged into the main repository via pull request after having successfully completed a review process. As a contributor, your basic workflow is as follows:

  1. [Fork](https://help.github.com/articles/fork-a-repo) the [Scala Project](https://github.com/scala/scala)
  - Create a [topic branch](http://git-scm.com/book/en/Git-Branching-Branching-Workflows#Topic-Branches)
  - Fix a [bug](https://issues.scala-lang.org/secure/IssueNavigator.jspa?reset=true&jqlQuery=labels+%3D+community), implement a feature
  - Push your changes to your fork on github
  - Submit [pull request](https://help.github.com/articles/using-pull-requests)
  - Work with a reviewer on [getting your request merged](https://github.com/scala/scala/wiki/Pull-Request-Policy)
  - Celebrate!

Read our [Git Commit Guide](git-guide.html) for details.

## Building

The Scala compiler and libraries are built using Ant. Read the [README](https://github.com/scala/scala/blob/master/README.rst) on how to build, test and create a distribution.

## Testing

We maintain an extensive test suite that is run via our parallel testing tool `partest`. Read our [Partest Guide](partest-guide.html) for details.

### Lukas's new build machine

Link, needs repo name and github username and builds/tests for you.

## What to work on

If you want to become a contributor but you don't know what to work on, here are a few ideas. Generally, it is a good idea to start with fixing bugs! To get some idea, head over to our [Scala issue tracker](https://issues.scala-lang.org/) and search for some unresolved bugs assigned to the community or click [here](https://issues.scala-lang.org/secure/IssueNavigator.jspa?reset=true&jqlQuery=labels+%3D+community) for a direct link. Here is a breakdown into different subprojects:

 - [Scaladoc](https://issues.scala-lang.org/secure/IssueNavigator!executeAdvanced.jspa?jqlQuery=labels+%3D+scaladoc+and+labels+%3D+community&runQuery=true&clear=true)
- [Standard Library](https://issues.scala-lang.org/secure/IssueNavigator!executeAdvanced.jspa?jqlQuery=labels+%3D+community+and+labels+%3D+library&runQuery=true&clear=true)
- [Compiler](https://issues.scala-lang.org/secure/IssueNavigator!executeAdvanced.jspa?jqlQuery=labels+%3D+community+and+labels+%3D+compiler&runQuery=true&clear=true)
- for the doc site

## Process

"gitting stuff done" document.

Where to ask questions. How-tos to mailing list, discussion pertaining to a
specific ticket on the issue tracker.

## Contributor's License Agreement

Before we can accept your pull request you have to sign our Contributor's License Agreement (CLA).

TODO: Heather

## Compiler Internals

The files below are recordings of code walk-through sessions by Martin Odersky about the Scala compiler internals. Some of the information is somewhat outdated, but the clips are still a good introduction to some parts of the compiler architecture.

 - [Scala Internals 2008-10-29 (Symbols 1)](http://www.scala-lang.org/sites/default/files/martin_ordersky_scala_internals_2008-10-29.avi)

   Handling of Symbols in the Scala compiler: some details on the symtab subdir, Symbols, Definitions, StdNames, Types (Lazy Types).

 - [Scala Internals 2008-11-05 (Symbols 2)](http://www.scala-lang.org/sites/default/files/martin_ordersky_scala_internals_2008-11-05.avi)

   Handling of Symbols part deux: more information on Symbols, Flags, Definitions.

 - [Scala Internals 2009-03-04 (Types)](http://www.scala-lang.org/sites/default/files/martin_ordersky_scala_internals_2009-03-04.avi)

   A detailed explanation about how types are represented and manipulated within the Scala compiler: data structures, manipulations of types, coding conventions (audio is not perfect, but intelligible).

## FAQ

### OSX

### Linux

### Windows

-->