---
layout: overview-large
title: Dependencies and setup

disqus: true

partof: quasiquotes
num: 1
outof: 13
languages: [ko]
---

## Scala 2.11

In Scala 2.11, quasiquotes are shipped in the official Scala distribution as part of `scala-reflect.jar`, so you don't need to do anything special to use them - just don't forget to add a dependency on `scala-reflect`.

All examples and code snippets in this guide are run under in 2.11 REPL with one extra line:

    scala> val universe: scala.reflect.runtime.universe.type = scala.reflect.runtime.universe
    scala> import universe._

A wildcard import from a universe (be it a runtime reflection universe like here or a compile-time universe provided in macros) is all that's needed to use quasiquotes. All of the examples will assume that import.

Additionally some examples that use `ToolBox` API will need a few more lines to get things rolling:

    scala> import scala.reflect.runtime.currentMirror
    scala> import scala.tools.reflect.ToolBox
    scala> val toolbox = currentMirror.mkToolBox()

Another tool you might want to be aware of is new and shiny `showCode` pretty printer (contributed by [@VladimirNik](https://github.com/VladimirNik)):

    scala> val C = q"class C"
    C: universe.ClassDef =
    class C extends scala.AnyRef {
      def <init>() = {
        super.<init>();
        ()
      }
    }

    scala> println(showCode(C))
    class C

Default pretty printer shows you contents of the tree in imaginary low-level Scala-like notation. `showCode` on the other hand will do its best to reconstruct actual source code equivalent to the given tree in proper Scala syntax.

On the other side of spectrum there is also a `showRaw` pretty printer that shows direct internal organization of the tree:

    scala> println(showRaw(q"class C"))
    ClassDef(Modifiers(), TypeName("C"), List(), Template(List(Select(Ident(scala), TypeName("AnyRef"))), noSelfType, List(DefDef(Modifiers(), termNames.CONSTRUCTOR, List(), List(List()), TypeTree(), Block(List(pendingSuperCall), Literal(Constant(())))))))

## Scala 2.10

In Scala 2.10, quasiquotes are only available via the [macro paradise compiler plugin](http://docs.scala-lang.org/overviews/macros/paradise.html).

In short, using quasiquotes in 2.10 is as simple as adding a single `addCompilerPlugin` line to your sbt build for the macro paradise plugin that enables quasiquotes and an additional `libraryDependencies` line for the supporting library that is necessary for quasiquotes to function in Scala 2.10. A full example is provided at [https://github.com/scalamacros/sbt-example-paradise](https://github.com/scalamacros/sbt-example-paradise).

New `showCode` pretty printer is not available under 2.10.

## sbt cross-compile

Here's a neat sbt snippet taken from [Spire](https://github.com/non/spire) that allows you to use quasiquotes and cross-compile against both Scala 2.10 and 2.11:

    libraryDependencies := {
      CrossVersion.partialVersion(scalaVersion.value) match {
        // if scala 2.11+ is used, quasiquotes are merged into scala-reflect
        case Some((2, scalaMajor)) if scalaMajor >= 11 =>
          libraryDependencies.value
        // in Scala 2.10, quasiquotes are provided by macro paradise
        case Some((2, 10)) =>
          libraryDependencies.value ++ Seq(
            compilerPlugin("org.scalamacros" % "paradise" % "2.0.0" cross CrossVersion.full),
            "org.scalamacros" %% "quasiquotes" % "2.0.0" cross CrossVersion.binary)
      }
    }

