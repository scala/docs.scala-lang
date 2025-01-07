---
title: A Taste of Scala
type: chapter
description: This chapter provides a high-level overview of the main features of the Scala 3 programming language.
languages: [ru, zh-cn]
num: 4
previous-page: why-scala-3
next-page: taste-hello-world
---


This chapter provides a whirlwind tour of the main features of the Scala 3 programming language.
After this initial tour, the rest of the book provides more details on these features, and the [Reference documentation][reference] provides _many_ more details.

## Setting Up Scala

Throughout this chapter, and the rest of the book, we encourage you to try out the examples by either copying
them or typing them out manually. The tools necessary to follow along with the examples on your own computer
can be installed by following our [getting started guide][get-started].

> Alternatively you can run the examples in a web browser with [Scastie](https://scastie.scala-lang.org), a
> fully online editor and code-runner for Scala.

## Comments

One good thing to know up front is that comments in Scala are just like comments in Java (and many other languages):

{% tabs comments %}
{% tab 'Scala 2 and 3' for=comments %}
```scala
// a single line comment

/*
 * a multiline comment
 */

/**
 * also a multiline comment
 */
```
{% endtab %}
{% endtabs %}

## IDEs

The two main IDEs (integrated development environments) for Scala are:

- [IntelliJ IDEA](/getting-started/intellij-track/building-a-scala-project-with-intellij-and-sbt.html)
- [Visual Studio Code](https://scalameta.org/metals/docs/editors/vscode/)

## Naming conventions

Another good thing to know is that Scala naming conventions follow the same “camel case” style as Java:

- Class names: `Person`, `StoreEmployee`
- Variable names: `name`, `firstName`
- Method names: `convertToInt`, `toUpper`

More on conventions used while writing Scala code can be found in the [Style Guide](/style/index.html).

[reference]: {{ site.scala3ref }}/overview.html
[get-started]: {% link _overviews/getting-started/install-scala.md %}
