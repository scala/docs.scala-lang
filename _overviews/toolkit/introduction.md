---
title: Introduction
type: chapter
description: Introducing the Scala Toolkit tutorials
num: 1
previous-page: 
next-page: testing-intro
toolkit-index:
  - title: Tests
    description: Testing code with MUnit.
    icon: "fa fa-vial-circle-check"
    link: /toolkit/testing-intro.html
  - title: Files and Processes
    description: Writing files and running processes with OS-Lib.
    icon: "fa fa-folder-open"
    link: /toolkit/os-intro.html
  - title: JSON
    description: Parsing JSON and serializing objects to JSON with uPickle.
    icon: "fa fa-file-code"
    link: /toolkit/json-intro.html
  - title: HTTP Requests
    description: Sending HTTP requests and uploading files with sttp.
    icon: "fa fa-globe"
    link: /toolkit/http-client-intro.html
  - title: Web servers
    description: Building web servers with Cask.
    icon: "fa fa-server"
    link: /toolkit/web-server-intro.html
---

## What is the Scala Toolkit?

The Scala Toolkit is a set of libraries designed to effectively perform common programming tasks. It includes tools for working with files and processes, parsing JSON, sending HTTP requests, and unit testing.

The Toolkit supports:
* Scala 3 and Scala 2
* JVM, Scala.js, and Scala Native

Use cases for the Toolkit include:

- short-lived programs running on the JVM, to scrape a website, to collect and transform data, or to fetch and process some files,
- frontend scripts that run on the browser and power your websites,
- command-line tools packaged as native binaries for instant startup

{% include inner-documentation-sections.html links=page.toolkit-index %}

## What are these tutorials?

This series of tutorials focuses on short code examples, to help you get started quickly.

If you need more in-depth information, the tutorials include links to further documentation for all of the libraries in the toolkit.

## How to run the code?

You can follow the tutorials regardless of how you choose to run your
Scala code. The tutorials focus on the code itself, not on the process
of running it.

Ways to run Scala code include:
* in your **browser** with [Scastie](https://scastie.scala-lang.org)
    * pros: zero installation, online sharing
    * cons: single-file only, online-only
* interactively in the Scala **REPL** (Read/Eval/Print Loop)
    * pros: interactive exploration in the terminal
    * cons: doesn't save your code anywhere
* interactively in a **worksheet** in your IDE such as [IntelliJ](https://www.jetbrains.com/help/idea/discover-intellij-idea-for-scala.html) or [Metals](http://scalameta.org/metals/)
    * pros: interactive exploration in a GUI
    * cons: requires worksheet environment to run
* in **scripts**, using [Scala CLI](https://scala-cli.virtuslab.com)
    * pros: terminal-based workflow with little setup
    * cons: may not be suitable for large projects
* using a **build tool** (such as [sbt](https://www.scala-sbt.org) or [mill](https://com-lihaoyi.github.io/mill/))
    * pros: terminal-based workflow for projects of any size
    * cons: requires some additional setup and learning
* using an **IDE** such as [IntelliJ](https://www.jetbrains.com/help/idea/discover-intellij-idea-for-scala.html) or [Metals](http://scalameta.org/metals/)
    * pros: GUI based workflow for projects of any size
    * cons: requires some additional setup and learning

These choices, with their pros and cons, are common to most programing
languages.
Feel free to use whichever option you're most comfortable with.
