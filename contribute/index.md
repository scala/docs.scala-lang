---
layout: page
title: Contribute
---

- This page should contain the introduction as mentioned in the Scala Doc team google document
- Subpages or subsections for contributing for each project (i.e. how to find tickets/features to work on)
- Building and contributing code (contributor's workflow)
  - link to a proper git etiquette page
  - link to CLA
  - how to run and use partest
  - compiler page (links to compiler-related docs i.e. reflection/macros/compiler-plugin guides, links to compiler internal videos, and useful info from wiki) (or should this go on docs.scala-lang?)
- Link to how to make a bug report

The Scala programming langauge is an open source project from École
Polytechnique Fédérale de Lausanne (EPFL) in Switzerland. The source of the
compiler and libraries is hosted on [github](http://github.com/scala/scala).

Some aspects of the language are easier to contribute to than others-- the
compiler, for example, is arguably the most difficult part of the Scala
project to successfully submit patches to.

If you're interested in joining our community and contributing to the project,
start simple-- often Scaladoc (Scala's javadoc-like tool, Example: [Scala
Standard Library API](www.scala-lang.org/api/current/index.html#package)) is
the best place to get started.


## Overview of the Scala Ecosystem

TODO: I feel this section belongs somewhere else and should be linked here.

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

